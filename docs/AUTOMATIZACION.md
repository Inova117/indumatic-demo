# Documentación del flujo de automatización

**Indumatic · Cobranza — Cobranza automatizada por WhatsApp**

Este documento explica, paso a paso, **todo el proceso** que ejecuta el sistema de
cobranza: cada nodo, qué hace, con qué datos trabaja, cómo decide y a dónde envía la
información. Está pensado para acompañar la pantalla **Automatización** de la demo (el
lienzo estilo n8n) y para servir de guía técnica de referencia.

> El flujo real es un *workflow* orquestado (equivalente a un proyecto de n8n) que corre
> de forma desatendida, 24/7. En la demo el flujo está representado de forma visual e
> interactiva; aquí se describe qué haría cada pieza en producción.

---

## 1. Visión general

El objetivo del flujo es **cobrar las facturas vencidas sin intervención manual**:
detectar deuda, decidir a quién contactar y cómo, enviar el recordatorio por WhatsApp
con un enlace de pago, verificar el pago automáticamente y escalar solo cuando de verdad
hace falta una persona.

En una frase: **detecta → segmenta → redacta → envía → espera → verifica → concilia o
reintenta / escala.**

| Métrica del flujo | Valor |
|---|---|
| Nodos | 18 |
| Integraciones | 5 (ERP, WhatsApp Business API, pasarela de pagos, base de datos, notificaciones) |
| Ramas de decisión | 4 (segmento, etapa Empresa, etapa Informal, ¿pago recibido?) |
| Ciclos | 1 (reintento de recordatorio hasta agotar la cadencia) |

### Integraciones conectadas

| Integración | Uso en el flujo |
|---|---|
| **ERP contable** | Origen de las facturas (disparador en tiempo real + fuente de la cartera). |
| **Base de datos** | Estado de cada factura, historial de recordatorios y métricas del dashboard. |
| **WhatsApp Business API** | Canal de envío de recordatorios y comprobantes. |
| **Pasarela de pagos** | Genera el enlace de pago y confirma el pago vía webhook. |
| **Notificaciones** | Escalamiento al analista (mensaje interno + creación de tarea). |

### Tipos de nodo (leyenda)

| Color | Tipo | Significado |
|---|---|---|
| 🟢 Verde | **Disparador** | Inicia el flujo (por tiempo o por evento). |
| 🔵 Azul | **Base de datos** | Lee o escribe información. |
| 🟣 Violeta | **Función** | Lógica / cálculo / transformación de datos. |
| 🟡 Ámbar | **Condición** | Bifurca el flujo según una regla (`Switch` / `IF`). |
| 🟢 Verde WA | **WhatsApp** | Envía un mensaje por WhatsApp. |
| 🟦 Índigo | **Plantilla** | Arma el texto del mensaje según el segmento. |
| ⚪ Gris | **Espera** | Pausa el flujo hasta el próximo paso. |
| 🔴 Rosa | **Notificación** | Alerta interna / escalamiento. |

---

## 2. Diagrama del flujo (referencia rápida)

```
 [Programador diario 08:00] ┐
                            ├─► (3) Obtener cuentas por cobrar ─► (4) Calcular días de mora ─► (5) Segmentar cliente
 [Factura emitida · ERP] ───┘                                                                        │
                                                                                                     ├─(Empresa)─► (6) Etapa cadencia ─► (7) Plantilla formal ─┐
                                                                                                     │                                                          │
                                                                                                     └─(Informal)─► (8) Etapa cadencia ─► (9) Plantilla cercana ┤
                                                                                                                                                                │
      ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
      ▼
 (10) Generar link de pago ─► (11) Enviar recordatorio (WhatsApp) ─► (12) Ventana de espera ─► (13) ¿Pago recibido?
                                                                                                     │
                                                        ┌────────────(Sí, pagó)──────────────────────┤
                                                        ▼                                             │
                                       (14) Marcar factura pagada                                     └──(No)──► (17) ¿Última etapa?
                                                        ▼                                                            │
                                       (15) Enviar comprobante (WhatsApp)                     (Agotada)──► (18) Escalar a analista
                                                        ▼                                                            │
                                       (16) Actualizar cartera y KPIs                       (Reintentar)──► vuelve a (10) [ciclo]
```

---

## 3. Explicación paso a paso (nodo por nodo)

Cada nodo se documenta con: **qué hace**, **entrada**, **salida** y **configuración clave**.

### Fase A — Disparadores (cómo arranca el proceso)

#### ① Programador diario · *Disparador*
- **Qué hace:** inicia el flujo automáticamente todos los días a una hora fija.
- **Configuración clave:** ejecución programada (cron) a las **08:00**.
- **Entrada:** ninguna (es un inicio).
- **Salida:** una señal de "ejecutar la revisión de cartera de hoy".
- **Por qué importa:** garantiza que la cobranza ocurra **sin que nadie tenga que
  acordarse** de hacerla. Es el reemplazo del "hoy me pongo a llamar".

#### ② Factura emitida · *Disparador (Webhook · ERP)*
- **Qué hace:** escucha en tiempo real cuando se **emite una factura nueva** en el ERP.
- **Configuración clave:** webhook conectado al sistema contable.
- **Entrada:** evento del ERP con los datos de la factura (cliente, monto, fecha de
  vencimiento, plazo).
- **Salida:** la factura entra al flujo para programar su cadencia desde el inicio
  (incluye el recordatorio **preventivo**, antes de vencer).
- **Por qué importa:** permite empezar a cuidar la factura **desde que nace**, no solo
  cuando ya está vencida.

> Ambos disparadores confluyen en el mismo punto: alimentan la carga de cartera.

---

### Fase B — Ingesta y preparación

#### ③ Obtener cuentas por cobrar · *Base de datos*
- **Qué hace:** consulta todas las facturas pendientes de pago.
- **Entrada:** señal del disparador.
- **Salida:** lista de facturas con sus datos: cliente, tipo, número, monto, fecha de
  vencimiento, estado actual, historial de recordatorios enviados.
- **Configuración clave:** filtra por estado ≠ *Pagado* y ≠ *Anulada*.

#### ④ Calcular días de mora · *Función*
- **Qué hace:** para cada factura, calcula los **días de mora** = fecha de hoy − fecha
  de vencimiento (negativo = aún no vence).
- **Entrada:** lista de facturas.
- **Salida:** la misma lista, ahora con el campo `díasDeMora` y una clasificación
  preliminar (*Al día · Por vencer · Vencido*).
- **Por qué importa:** este número es el que decide **qué mensaje** corresponde a cada
  cliente en la cadencia.

---

### Fase C — Segmentación (a quién y cómo)

#### ⑤ Segmentar cliente · *Condición (Switch)*
- **Qué hace:** separa cada factura en una de dos rutas según el **tipo de cliente**.
- **Entrada:** factura con días de mora.
- **Salidas (2 ramas):**
  - **Empresa** → cadencia formal y espaciada.
  - **Informal** → cadencia cercana y más frecuente.
- **Por qué importa:** el sistema **no trata igual** a una empresa que a un cliente
  informal. Las empresas responden a un tono corporativo; los informales —los que más se
  atrasan— necesitan mensajes más seguidos y cercanos.

---

### Fase D — Cadencia por segmento

Cada rama define **cuándo** se contacta al cliente respecto al vencimiento.

#### ⑥ Etapa de cadencia — Empresa · *Condición (Switch)*
- **Qué hace:** según los días de mora, decide qué paso de la cadencia **Empresa** toca.
- **Cadencia Empresa:** días **−5, 0, +10, +20** (tono formal).

  | Paso | Día | Momento | Tono |
  |---|---|---|---|
  | 1 | −5 | Pre-vencimiento | Amable / recordatorio |
  | 2 | 0 | Día de vencimiento | Recordatorio |
  | 3 | +10 | Seguimiento firme | Firme |
  | 4 | +20 | Escalamiento | Escalado (coordinar pago / plan) |

#### ⑦ Plantilla tono formal · *Plantilla (Set)*
- **Qué hace:** arma el **texto del mensaje** para empresas, con trato de usted y estilo
  corporativo, insertando los datos de la factura (número, monto, fecha).
- **Ejemplo (paso pre-vencimiento):**
  > *"Estimados de Metalúrgica Sur, les recordamos que la factura F-2026-0471 por
  > $5,400.00 vence el 19 jun 2026. Puede realizar su pago de forma segura en el
  > siguiente enlace:"*

#### ⑧ Etapa de cadencia — Informal · *Condición (Switch)*
- **Qué hace:** igual que el ⑥ pero con la cadencia **Informal**, más frecuente.
- **Cadencia Informal:** días **−3, 0, +5, +12** (tono cercano).

  | Paso | Día | Momento | Tono |
  |---|---|---|---|
  | 1 | −3 | Pre-vencimiento | Cercano / amable |
  | 2 | 0 | Día de vencimiento | Recordatorio |
  | 3 | +5 | Recordatorio cercano | Firme-amable |
  | 4 | +12 | Escalamiento | Escalado (coordinar pago / plan) |

#### ⑨ Plantilla tono cercano · *Plantilla (Set)*
- **Qué hace:** arma el mensaje para clientes informales, con trato cercano, nombre de
  pila y lenguaje directo.
- **Ejemplo (día de vencimiento):**
  > *"Hola Don José 👋 su factura F-2026-0402 por $1,250.00 vence hoy. Puede pagarla en
  > un clic aquí 👇"*

> Las dos ramas (Empresa e Informal) **se reunifican** aquí: sin importar el segmento,
> el flujo continúa igual para generar el enlace y enviar.

---

### Fase E — Generación y envío

#### ⑩ Generar link de pago · *Función (Pasarela)*
- **Qué hace:** crea un **enlace de pago único** para esa factura a través de la pasarela.
- **Entrada:** factura + mensaje redactado.
- **Salida:** URL de pago segura asociada a la factura y su monto.
- **Configuración clave:** el enlace queda vinculado al `id` de la factura para poder
  conciliar el pago después.
- **Por qué importa:** el cliente paga **desde el mismo WhatsApp**, sin llamadas ni ir al
  banco. Menos fricción = se cobra más rápido.

#### ⑪ Enviar recordatorio · *WhatsApp*
- **Qué hace:** envía el mensaje por **WhatsApp Business API** al número del cliente,
  incluyendo el botón/enlace de pago (excepto en el paso de escalamiento, que pide
  coordinar el pago).
- **Entrada:** mensaje + enlace de pago + teléfono del cliente.
- **Salida:** confirmación de envío; se registra en la base de datos que el paso N de la
  cadencia ya fue enviado.
- **Nota:** en la demo, esto es lo que dispara el botón **▶ Ejecutar recordatorios** de
  la pantalla *Cartera* y los mensajes que se ven al abrir el chat de un cliente.

#### ⑫ Ventana de espera · *Espera (Wait)*
- **Qué hace:** pausa el flujo hasta el **próximo paso de la cadencia** o hasta que
  llegue la confirmación de pago, lo que ocurra primero.
- **Entrada:** recordatorio enviado.
- **Salida:** reanuda el flujo cuando corresponde verificar el pago.
- **Por qué importa:** da al cliente tiempo razonable para pagar antes de volver a
  contactarlo. Evita ser invasivo y respeta la cadencia.

---

### Fase F — Verificación de pago (el momento de la verdad)

#### ⑬ ¿Pago recibido? · *Condición (IF · Webhook pasarela)*
- **Qué hace:** comprueba si la pasarela notificó el **pago de esa factura**.
- **Entrada:** estado del pago (por webhook de la pasarela).
- **Salidas (2 ramas):**
  - **Sí, pagó** → conciliación (nodos ⑭–⑯).
  - **No** → evaluación de escalamiento / reintento (nodos ⑰–⑱ y ciclo).

---

### Fase G — Rama "Sí, pagó" (conciliación automática)

#### ⑭ Marcar factura pagada · *Base de datos*
- **Qué hace:** cambia el estado de la factura a **Pagado** y guarda fecha/monto.
- **Salida:** cartera actualizada; el cliente sale de la lista de morosos.

#### ⑮ Enviar comprobante · *WhatsApp*
- **Qué hace:** envía por WhatsApp la **confirmación / comprobante** del pago.
- **Por qué importa:** cierra el círculo con una buena experiencia y deja constancia.

#### ⑯ Actualizar cartera y KPIs · *Base de datos / Dashboard*
- **Qué hace:** recalcula las métricas del dashboard en vivo: cartera vencida (baja),
  recuperado del mes (sube), clientes en mora (baja), días promedio de cobro.
- **Salida:** el tablero de *Cartera* y *Reportes* reflejan el cobro al instante.

---

### Fase H — Rama "No pagó" (persistencia y escalamiento)

#### ⑰ ¿Última etapa de cadencia? · *Condición (IF)*
- **Qué hace:** evalúa si ya se **agotaron todos los pasos** de la cadencia del cliente
  (+20 en Empresa, +12 en Informal).
- **Salidas (2 ramas):**
  - **Agotada** → escalar a una persona (nodo ⑱).
  - **Reintentar** → volver al envío del próximo recordatorio (**ciclo**).

#### ⑱ Escalar a analista · *Notificación*
- **Qué hace:** cuando la cadencia automática no logró el cobro, **notifica al analista
  de cobranza** y crea una tarea para gestión manual (llamada, visita, plan de pagos).
- **Por qué importa:** la persona interviene **solo en los casos difíciles**, no en los
  cientos de recordatorios rutinarios. Ahí es donde su tiempo vale.

#### 🔁 Ciclo de reintento
- **Qué hace:** si aún quedan pasos de cadencia, el flujo **vuelve al nodo ⑩** para
  programar y enviar el siguiente recordatorio en la fecha correspondiente.
- **Representación en el lienzo:** es la flecha curva punteada (ámbar, "Reintentar") que
  regresa hacia el envío. Es el "seguir insistiendo, con criterio y sin cansarse".

---

## 4. Qué datos viajan por el flujo

Cada factura se mueve por el flujo como un "paquete" de datos que se va enriqueciendo:

| Campo | Se agrega en | Ejemplo |
|---|---|---|
| `cliente`, `tipo`, `factura`, `monto`, `vence`, `telefono` | ③ Obtener cartera | Lácteos Andinos · Empresa · F-2026-0498 · $4,250.00 |
| `diasDeMora` | ④ Calcular mora | +5 |
| `segmento` | ⑤ Segmentar | Empresa |
| `pasoCadencia` | ⑥ / ⑧ Etapa | Paso 2 (día 0) |
| `mensaje` | ⑦ / ⑨ Plantilla | *"Estimados… vence hoy…"* |
| `linkPago` | ⑩ Generar link | https://pago…/F-2026-0498 |
| `estadoEnvio` | ⑪ Enviar | Enviado ✓✓ |
| `estadoPago` | ⑬ ¿Pago? | Pendiente / Pagado |

---

## 5. Reglas de negocio clave

- **Preventivo primero:** siempre se intenta avisar **antes** de vencer (día −5 / −3).
  Cobrar a tiempo es más barato que recuperar mora.
- **Segmentación de tono y frecuencia:** empresas = formal y espaciado; informales =
  cercano y frecuente.
- **Un enlace por factura:** cada mensaje lleva su propio enlace de pago conciliable.
- **Sin dobles molestias:** si el cliente paga, el flujo **deja de enviar** recordatorios
  de esa factura de inmediato (la verificación corta la cadencia).
- **Escalamiento selectivo:** la persona solo entra cuando la automatización agotó su
  secuencia. El sistema hace el 90% del trabajo repetitivo.

---

## 6. Correspondencia con la demo

| En la demo (pantalla) | Qué parte del flujo representa |
|---|---|
| **Cartera** → botón *Ejecutar recordatorios* | Nodos ⑪ (envío) → ⑬ (verificación) → ⑭–⑯ (conciliación) ejecutándose en vivo. |
| **Cartera** → chat de WhatsApp de un cliente | Nodos ⑦/⑨ (plantillas) y ⑪ (envíos) según la cadencia del segmento. |
| **Cartera** → botón *Pagar factura* → pago | Nodo ⑩ (link de pago) + ⑬ (webhook de pago) + ⑭ (marcar pagada). |
| **Segmentación** | Nodos ⑤–⑨ (segmento, cadencias y tono). |
| **Automatización** | El flujo completo (los 18 nodos de este documento). |
| **Reportes** | Nodo ⑯ (métricas y KPIs actualizados). |

---

*Documento de referencia · Indumatic · Cobranza. El detalle de cadencias, plantillas y
datos de ejemplo vive en `src/mockData.js`; el diagrama interactivo, en
`src/components/Automatizaciones.jsx`.*
