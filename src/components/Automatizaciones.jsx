import { useRef, useState, useCallback } from 'react'
import {
  IconClock,
  IconWebhook,
  IconDatabase,
  IconFx,
  IconBranch,
  IconWhatsApp,
  IconCard,
  IconBell,
  IconWorkflow,
  IconPlug,
  IconPlus,
  IconMinus,
  IconMaximize,
  IconBolt,
  IconCheck,
  IconShield,
  IconMail,
  IconPhone,
} from './icons'
import { cadencias } from '../mockData'

// ---------------------------------------------------------------------------
//  Definición del flujo (estilo n8n) — nodos y conexiones
// ---------------------------------------------------------------------------
const NW = 226 // ancho de nodo
const NH = 66 // alto de nodo
const GRAPH_W = 4450
const GRAPH_H = 660

const TIPOS = {
  trigger: { chip: 'bg-emerald-500', tag: 'Disparador', tagCls: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-200' },
  data: { chip: 'bg-brand-600', tag: 'Base de datos', tagCls: 'bg-brand-50 text-brand-600', border: 'border-brand-200' },
  function: { chip: 'bg-violet-500', tag: 'Función', tagCls: 'bg-violet-50 text-violet-600', border: 'border-violet-200' },
  switch: { chip: 'bg-amber-500', tag: 'Condición', tagCls: 'bg-amber-50 text-amber-600', border: 'border-amber-200' },
  whatsapp: { chip: 'bg-[#25d366]', tag: 'WhatsApp', tagCls: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-200' },
  email: { chip: 'bg-brand-600', tag: 'Email', tagCls: 'bg-brand-50 text-brand-600', border: 'border-brand-200' },
  set: { chip: 'bg-indigo-500', tag: 'Plantilla', tagCls: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-200' },
  wait: { chip: 'bg-slate-400', tag: 'Espera', tagCls: 'bg-slate-100 text-slate-500', border: 'border-slate-200' },
  notify: { chip: 'bg-rose-500', tag: 'Tarea humana', tagCls: 'bg-rose-50 text-rose-600', border: 'border-rose-200' },
}

const NODES = [
  { id: 'trg_sched', x: 40, y: 70, tipo: 'trigger', icon: IconClock, titulo: 'Programador diario', sub: 'Cada día · 08:00' },
  { id: 'trg_erp', x: 40, y: 220, tipo: 'trigger', icon: IconWebhook, titulo: 'Factura emitida', sub: 'Webhook · ERP contable' },
  { id: 'db_load', x: 330, y: 145, tipo: 'data', icon: IconDatabase, titulo: 'Obtener cuentas por cobrar', sub: 'Consulta base de datos' },
  { id: 'fn_mora', x: 620, y: 145, tipo: 'function', icon: IconFx, titulo: 'Calcular días de mora', sub: 'Función · por factura' },
  { id: 'sw_seg', x: 910, y: 145, tipo: 'switch', icon: IconBranch, titulo: 'Segmentar cliente', sub: 'Switch · Empresa / Informal' },
  { id: 'sw_cadE', x: 1200, y: 35, tipo: 'switch', icon: IconBranch, titulo: 'Etapa de cadencia', sub: 'Empresa · −5·0·+10·+20' },
  { id: 'set_tplE', x: 1490, y: 35, tipo: 'set', icon: IconWorkflow, titulo: 'Plantilla tono formal', sub: 'Redactar mensaje' },
  { id: 'sw_cadI', x: 1200, y: 255, tipo: 'switch', icon: IconBranch, titulo: 'Etapa de cadencia', sub: 'Informal · −3·0·+5·+12' },
  { id: 'set_tplI', x: 1490, y: 255, tipo: 'set', icon: IconWorkflow, titulo: 'Plantilla tono cercano', sub: 'Redactar mensaje' },
  { id: 'fn_link', x: 1780, y: 145, tipo: 'function', icon: IconCard, titulo: 'Generar link de pago', sub: 'Pasarela · enlace único' },
  // ---- MOTOR MULTICANAL: elegir canal, enviar, y respaldar si falla ----------
  { id: 'sw_canal', x: 2070, y: 145, tipo: 'switch', icon: IconBranch, titulo: '¿Qué canal usar?', sub: '¿Autorizó WhatsApp? ¿Nº sano?' },
  { id: 'wa_send', x: 2360, y: 35, tipo: 'whatsapp', icon: IconWhatsApp, titulo: 'Enviar por WhatsApp', sub: 'Plantilla Utility aprobada' },
  { id: 'mail_send', x: 2360, y: 255, tipo: 'email', icon: IconMail, titulo: 'Enviar por Email', sub: 'Mismo enlace de pago' },
  { id: 'if_deliv', x: 2650, y: 35, tipo: 'switch', icon: IconBranch, titulo: '¿Se entregó?', sub: 'Webhook de estado · Meta' },
  { id: 'wait_win', x: 2940, y: 145, tipo: 'wait', icon: IconClock, titulo: 'Ventana de espera', sub: 'Hasta el próximo paso' },
  { id: 'if_pay', x: 3230, y: 145, tipo: 'switch', icon: IconBranch, titulo: '¿Pago recibido?', sub: 'Webhook pasarela · IF' },
  { id: 'db_paid', x: 3520, y: 35, tipo: 'data', icon: IconDatabase, titulo: 'Marcar factura pagada', sub: 'Actualizar estado' },
  { id: 'wa_receipt', x: 3810, y: 35, tipo: 'whatsapp', icon: IconWhatsApp, titulo: 'Enviar comprobante', sub: 'Confirmación al cliente' },
  { id: 'db_upd', x: 4100, y: 35, tipo: 'data', icon: IconDatabase, titulo: 'Actualizar cartera y KPIs', sub: 'Dashboard en vivo' },
  { id: 'if_last', x: 3520, y: 275, tipo: 'switch', icon: IconBranch, titulo: '¿Última etapa de cadencia?', sub: 'IF · fin de la secuencia' },
  { id: 'notify', x: 3810, y: 275, tipo: 'notify', icon: IconPhone, titulo: 'Escalar a analista', sub: 'Tarea de llamada · no mensaje' },
]

const EDGES = [
  { from: 'trg_sched', to: 'db_load' },
  { from: 'trg_erp', to: 'db_load' },
  { from: 'db_load', to: 'fn_mora' },
  { from: 'fn_mora', to: 'sw_seg' },
  { from: 'sw_seg', fromPort: 'a', to: 'sw_cadE', label: 'Empresa' },
  { from: 'sw_seg', fromPort: 'b', to: 'sw_cadI', label: 'Informal' },
  { from: 'sw_cadE', to: 'set_tplE' },
  { from: 'set_tplE', to: 'fn_link' },
  { from: 'sw_cadI', to: 'set_tplI' },
  { from: 'set_tplI', to: 'fn_link' },
  { from: 'fn_link', to: 'sw_canal' },
  // Decisión de canal
  { from: 'sw_canal', fromPort: 'a', to: 'wa_send', label: 'Autorizado', accent: 'emerald' },
  { from: 'sw_canal', fromPort: 'b', to: 'mail_send', label: 'Sin autorización', accent: 'blue' },
  { from: 'wa_send', to: 'if_deliv' },
  { from: 'if_deliv', fromPort: 'a', to: 'wait_win', label: 'Entregado', accent: 'emerald' },
  // RESPALDO AUTOMÁTICO: si WhatsApp falla, reenvía por email solo.
  { from: 'if_deliv', fromPort: 'b', to: 'mail_send', label: 'Falló · 132015 → Email', accent: 'amber', fallback: true },
  { from: 'mail_send', to: 'wait_win' },
  { from: 'wait_win', to: 'if_pay' },
  { from: 'if_pay', fromPort: 'a', to: 'db_paid', label: 'Sí, pagó', accent: 'emerald' },
  { from: 'db_paid', to: 'wa_receipt' },
  { from: 'wa_receipt', to: 'db_upd' },
  { from: 'if_pay', fromPort: 'b', to: 'if_last', label: 'No', accent: 'rose' },
  { from: 'if_last', fromPort: 'a', to: 'notify', label: 'Agotada', accent: 'rose' },
  { from: 'if_last', fromPort: 'b', to: 'fn_link', label: 'Reintentar', accent: 'amber', loop: true },
]

const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n]))

// ---------------------------------------------------------------------------
//  Documentación paso a paso (se muestra debajo del lienzo)
// ---------------------------------------------------------------------------
const DOC_PHASES = [
  {
    letra: 'A',
    nombre: 'Disparadores',
    resumen: 'Cómo arranca el proceso, solo.',
    nodos: [
      {
        n: 1, tipo: 'trigger', icon: IconClock, titulo: 'Programador diario',
        que: 'Inicia el flujo automáticamente todos los días a las 08:00, sin que nadie tenga que acordarse.',
        importa: 'Reemplaza el “hoy me pongo a llamar”: la cobranza ocurre sí o sí.',
      },
      {
        n: 2, tipo: 'trigger', icon: IconWebhook, titulo: 'Factura emitida (ERP)',
        que: 'Un webhook escucha en tiempo real cada factura nueva emitida en el sistema contable.',
        importa: 'Permite cuidar la factura desde que nace, incluido el aviso preventivo antes de vencer.',
      },
    ],
  },
  {
    letra: 'B',
    nombre: 'Ingesta y preparación',
    resumen: 'Reúne la cartera y calcula la mora de cada factura.',
    nodos: [
      {
        n: 3, tipo: 'data', icon: IconDatabase, titulo: 'Obtener cuentas por cobrar',
        que: 'Consulta en la base de datos todas las facturas pendientes con sus datos e historial de recordatorios.',
      },
      {
        n: 4, tipo: 'function', icon: IconFx, titulo: 'Calcular días de mora',
        que: 'Para cada factura calcula los días de mora (hoy − vencimiento) y la clasifica: al día, por vencer o vencido.',
        importa: 'Este número decide qué mensaje de la cadencia le corresponde a cada cliente.',
      },
    ],
  },
  {
    letra: 'C',
    nombre: 'Segmentación',
    resumen: 'Decide a quién contactar y con qué criterio.',
    nodos: [
      {
        n: 5, tipo: 'switch', icon: IconBranch, titulo: 'Segmentar cliente',
        que: 'Un Switch separa cada factura en dos rutas según el tipo de cliente: Empresa o Informal.',
        importa: 'El sistema no trata igual a una empresa que a un cliente informal; el tono y la frecuencia cambian.',
      },
    ],
  },
  {
    letra: 'D',
    nombre: 'Cadencia por segmento',
    resumen: 'Cuándo y cómo se redacta cada mensaje según el segmento.',
    cadencia: true,
    nodos: [
      {
        n: 6, tipo: 'switch', icon: IconBranch, titulo: 'Etapa de cadencia · Empresa',
        que: 'Según los días de mora, elige el paso que toca en la cadencia Empresa (−5, 0, +10, +20).',
      },
      {
        n: 7, tipo: 'set', icon: IconWorkflow, titulo: 'Plantilla tono formal',
        que: 'Arma el texto con trato de usted y estilo corporativo, insertando número, monto y fecha de la factura.',
      },
      {
        n: 8, tipo: 'switch', icon: IconBranch, titulo: 'Etapa de cadencia · Informal',
        que: 'Igual que el anterior, pero con la cadencia Informal, más frecuente (−3, 0, +5, +12).',
      },
      {
        n: 9, tipo: 'set', icon: IconWorkflow, titulo: 'Plantilla tono cercano',
        que: 'Arma el mensaje con trato cercano, nombre de pila y lenguaje directo.',
        importa: 'Las dos ramas se reunifican aquí: de acá en adelante el flujo continúa igual.',
      },
    ],
  },
  {
    letra: 'E',
    nombre: 'Motor multicanal · el corazón del sistema',
    resumen: 'Genera el enlace, elige el canal y respalda solo si algo falla.',
    nodos: [
      {
        n: 10, tipo: 'function', icon: IconCard, titulo: 'Generar link de pago',
        que: 'Crea un enlace de pago único para esa factura en la pasarela, vinculado a su número.',
        importa: 'El mismo enlace viaja por cualquier canal. El cliente paga en un clic, sin llamar ni ir al banco.',
      },
      {
        n: 11, tipo: 'switch', icon: IconBranch, titulo: '¿Qué canal usar?',
        que: 'Comprueba dos cosas: si el cliente autorizó WhatsApp, y si la salud del número está en verde. Si ambas se cumplen, usa WhatsApp; si no, email.',
        importa: 'WhatsApp es el canal, no el producto. Si no está disponible, el cobro sigue igual por otro lado.',
      },
      {
        n: 12, tipo: 'whatsapp', icon: IconWhatsApp, titulo: 'Enviar por WhatsApp',
        que: 'Envía una plantilla Utility aprobada por Meta, con el enlace de pago y una salida fácil para quien no quiera más mensajes.',
        importa: 'Mejor tasa de lectura y de pago. La salida fácil evita bloqueos, que son lo que castiga Meta.',
      },
      {
        n: 13, tipo: 'email', icon: IconMail, titulo: 'Enviar por Email',
        que: 'Envía el mismo recordatorio con el mismo enlace de pago, sin depender de plataformas externas.',
        importa: 'Es la red de seguridad: cubre a los clientes sin autorización y cualquier fallo de WhatsApp.',
      },
      {
        n: 14, tipo: 'switch', icon: IconBranch, titulo: '¿Se entregó?',
        que: 'Meta avisa por webhook si el mensaje no llegó (código 132015). Si falla, el sistema reenvía por email automáticamente.',
        importa: 'Ninguna factura se queda sin gestionar porque WhatsApp haya fallado. El respaldo es automático.',
      },
      {
        n: 15, tipo: 'wait', icon: IconClock, titulo: 'Ventana de espera',
        que: 'Pausa el flujo hasta el próximo paso de la cadencia o hasta que llegue la confirmación de pago.',
        importa: 'Da un tiempo razonable para pagar, sin ser invasivo.',
      },
    ],
  },
  {
    letra: 'F',
    nombre: 'Verificación de pago',
    resumen: 'El momento de la verdad: ¿pagó o no?',
    nodos: [
      {
        n: 16, tipo: 'switch', icon: IconBranch, titulo: '¿Pago recibido?',
        que: 'Un IF comprueba, vía webhook de la pasarela, si la factura fue pagada, y bifurca en “Sí” o “No”.',
      },
    ],
  },
  {
    letra: 'G',
    nombre: 'Sí pagó · conciliación automática',
    resumen: 'Registra el pago y actualiza todo, solo.',
    nodos: [
      {
        n: 17, tipo: 'data', icon: IconDatabase, titulo: 'Marcar factura pagada',
        que: 'Cambia el estado de la factura a Pagado con fecha y monto; el cliente sale de la mora.',
      },
      {
        n: 18, tipo: 'whatsapp', icon: IconWhatsApp, titulo: 'Enviar comprobante',
        que: 'Envía la confirmación del pago por el mismo canal por el que se contactó al cliente.',
        importa: 'Cierra el círculo con una buena experiencia y deja constancia.',
      },
      {
        n: 19, tipo: 'data', icon: IconDatabase, titulo: 'Actualizar cartera y KPIs',
        que: 'Recalcula en vivo la cartera vencida, el recuperado del mes, los clientes en mora y los días de cobro.',
        importa: 'El tablero de Cartera y Reportes refleja el cobro al instante.',
      },
    ],
  },
  {
    letra: 'H',
    nombre: 'No pagó · escalamiento a una persona',
    resumen: 'Insiste con criterio y escala solo lo difícil — nunca con presión.',
    nodos: [
      {
        n: 20, tipo: 'switch', icon: IconBranch, titulo: '¿Última etapa de cadencia?',
        que: 'Un IF evalúa si ya se agotaron todos los pasos de la cadencia (+20 en Empresa, +12 en Informal).',
      },
      {
        n: 21, tipo: 'notify', icon: IconPhone, titulo: 'Escalar a analista',
        que: 'Si la cadencia no logró el cobro, crea una TAREA DE LLAMADA para el analista. No envía un mensaje conminatorio.',
        importa: 'El tono duro nunca va por WhatsApp: eso es lo que genera bloqueos y pone en riesgo el número. La conversación difícil la tiene una persona.',
      },
    ],
  },
]

const REGLAS = [
  { t: 'Preventivo primero', d: 'Siempre se intenta avisar antes de vencer (día −5 / −3). Cobrar a tiempo es más barato que recuperar mora.' },
  { t: 'Tono y frecuencia por segmento', d: 'Formal y espaciado para empresas; cercano y frecuente para clientes informales.' },
  { t: 'Un enlace por factura', d: 'Cada mensaje lleva su propio enlace de pago, conciliable de forma automática.' },
  { t: 'Sin dobles molestias', d: 'Si el cliente paga, la cadencia de esa factura se corta al instante.' },
  { t: 'Escalamiento selectivo', d: 'La persona entra solo cuando la automatización agotó su secuencia.' },
]

const DATOS = [
  { campo: 'cliente · tipo · factura · monto · vence · teléfono', fase: '③ Obtener cartera', ej: 'Lácteos Andinos · Empresa · F-2026-0498 · $4,250.00' },
  { campo: 'díasDeMora', fase: '④ Calcular mora', ej: '+5' },
  { campo: 'segmento', fase: '⑤ Segmentar', ej: 'Empresa' },
  { campo: 'pasoCadencia', fase: '⑥ / ⑧ Etapa', ej: 'Paso 2 (día 0)' },
  { campo: 'mensaje', fase: '⑦ / ⑨ Plantilla', ej: '“Estimados… vence hoy…”' },
  { campo: 'linkPago', fase: '⑩ Generar link', ej: 'pago…/F-2026-0498' },
  { campo: 'estadoPago', fase: '⑬ ¿Pago recibido?', ej: 'Pendiente / Pagado' },
]

const DEMO_MAP = [
  { p: 'Cartera · botón Ejecutar recordatorios', q: 'Nodos ⑪ envío → ⑬ verificación → ⑭–⑯ conciliación, en vivo.' },
  { p: 'Cartera · chat de WhatsApp del cliente', q: 'Plantillas ⑦/⑨ y envíos ⑪ según la cadencia del segmento.' },
  { p: 'Cartera · botón Pagar factura', q: 'Link de pago ⑩ + webhook de pago ⑬ + marcar pagada ⑭.' },
  { p: 'Segmentación', q: 'Nodos ⑤–⑨: segmento, cadencias y tono.' },
  { p: 'Reportes', q: 'Nodo ⑯: métricas y KPIs actualizados.' },
]

function NodeDocCard({ nodo }) {
  const t = TIPOS[nodo.tipo]
  const Icon = nodo.icon
  return (
    <div className="flex gap-3.5 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-card">
      <div className="relative shrink-0">
        <div className={`grid h-10 w-10 place-items-center rounded-lg text-white ${t.chip}`}>
          <Icon className="w-[22px] h-[22px]" />
        </div>
        <span className="absolute -left-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-slate-900 text-[10px] font-bold text-white ring-2 ring-white">
          {nodo.n}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-[13.5px] font-bold text-slate-800">{nodo.titulo}</h4>
          <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${t.tagCls}`}>
            {t.tag}
          </span>
        </div>
        <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{nodo.que}</p>
        {nodo.importa && (
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-500">
            <span className="font-semibold text-brand-600">Por qué importa: </span>
            {nodo.importa}
          </p>
        )}
      </div>
    </div>
  )
}

function CadenceMini({ tipoKey, accent }) {
  const cad = cadencias[tipoKey]
  const head = accent === 'brand' ? 'text-brand-700' : 'text-amber-700'
  const chip = accent === 'brand' ? 'bg-brand-600' : 'bg-amber-500'
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <div className={`text-sm font-bold ${head}`}>{cad.nombre}</div>
      <div className="text-[11px] text-slate-400">Tono {cad.tono.toLowerCase()} · {cad.frecuencia}</div>
      <div className="mt-3 space-y-1.5">
        {cad.pasos.map((paso) => (
          <div key={paso.dia} className="flex items-center gap-2.5">
            <span className={`grid h-6 w-9 shrink-0 place-items-center rounded-md text-[11px] font-bold text-white ${chip}`}>
              {paso.dia === 0 ? '0' : paso.dia < 0 ? `−${Math.abs(paso.dia)}` : `+${paso.dia}`}
            </span>
            <span className="text-[13px] text-slate-600">{paso.etiqueta}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function portY(node, port) {
  if (port === 'a') return node.y + 22
  if (port === 'b') return node.y + NH - 22
  return node.y + NH / 2
}
function outPoint(node, port) {
  return { x: node.x + NW, y: portY(node, port) }
}
function inPoint(node) {
  return { x: node.x, y: node.y + NH / 2 }
}

function edgePath(e) {
  const from = nodeById[e.from]
  const to = nodeById[e.to]
  const p1 = outPoint(from, e.fromPort)
  const p2 = inPoint(to)
  if (e.loop) {
    // Ciclo de reintento: gran arco por debajo del flujo
    return `M ${p1.x} ${p1.y} C ${p1.x + 220} ${p1.y + 300}, ${p2.x - 240} ${p2.y + 360}, ${p2.x} ${p2.y}`
  }
  if (e.fallback) {
    // Respaldo automático: arco corto hacia atrás y abajo, hacia el canal alterno
    return `M ${p1.x} ${p1.y} C ${p1.x + 150} ${p1.y + 150}, ${p2.x - 170} ${p2.y - 140}, ${p2.x} ${p2.y}`
  }
  const dx = p2.x - p1.x
  const c = Math.max(Math.min(Math.abs(dx) * 0.55, 150), 45)
  return `M ${p1.x} ${p1.y} C ${p1.x + c} ${p1.y}, ${p2.x - c} ${p2.y}, ${p2.x} ${p2.y}`
}

function edgeLabelPos(e) {
  const from = nodeById[e.from]
  const to = nodeById[e.to]
  const p1 = outPoint(from, e.fromPort)
  const p2 = inPoint(to)
  if (e.loop) return { x: (p1.x + p2.x) / 2, y: Math.max(p1.y, p2.y) + 250 }
  if (e.fallback) return { x: (p1.x + p2.x) / 2 + 30, y: (p1.y + p2.y) / 2 + 34 }
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 - 10 }
}

const ACCENTS = {
  emerald: '#10b981',
  rose: '#f43f5e',
  amber: '#f59e0b',
  blue: '#1e4f9c',
}

function FlowNode({ node }) {
  const t = TIPOS[node.tipo]
  const Icon = node.icon
  const esTrigger = node.tipo === 'trigger'
  const outputs = node.tipo === 'switch' ? ['a', 'b'] : ['x']
  return (
    <div
      className={`absolute rounded-xl border ${t.border} bg-white shadow-[0_2px_10px_-2px_rgba(16,40,74,0.12)] transition-shadow hover:shadow-[0_8px_24px_-6px_rgba(16,40,74,0.28)]`}
      style={{ left: node.x, top: node.y, width: NW, height: NH }}
    >
      <div className="flex h-full items-center gap-3 px-3">
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-white ${t.chip}`}>
          <Icon className="w-[22px] h-[22px]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-bold leading-tight text-slate-800">{node.titulo}</div>
          <div className="mt-0.5 truncate text-[11px] text-slate-400">{node.sub}</div>
        </div>
      </div>
      <span className={`absolute -top-2 right-2 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${t.tagCls}`}>
        {t.tag}
      </span>

      {/* Conectores */}
      {!esTrigger && (
        <span className="absolute -left-[5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-white bg-slate-300" />
      )}
      {esTrigger && (
        <span className="absolute -left-[7px] top-1/2 grid h-4 w-4 -translate-y-1/2 place-items-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
          <IconBolt className="w-2.5 h-2.5" />
        </span>
      )}
      {outputs.map((p) => (
        <span
          key={p}
          className="absolute -right-[5px] h-2.5 w-2.5 rounded-full border-2 border-white bg-slate-300"
          style={{ top: portY(node, p === 'x' ? 'c' : p) - node.y - 5 }}
        />
      ))}
    </div>
  )
}

export default function Automatizaciones() {
  const [view, setView] = useState({ scale: 0.62, x: 20, y: 24 })
  const drag = useRef(null)
  const viewportRef = useRef(null)

  const onDown = useCallback(
    (e) => {
      drag.current = { sx: e.clientX, sy: e.clientY, ox: view.x, oy: view.y }
    },
    [view.x, view.y],
  )
  const onMove = useCallback((e) => {
    if (!drag.current) return
    const { sx, sy, ox, oy } = drag.current
    setView((v) => ({ ...v, x: ox + (e.clientX - sx), y: oy + (e.clientY - sy) }))
  }, [])
  const onUp = useCallback(() => {
    drag.current = null
  }, [])

  const zoom = (delta) =>
    setView((v) => ({ ...v, scale: Math.min(1.4, Math.max(0.32, +(v.scale + delta).toFixed(2))) }))
  const fit = () => setView({ scale: 0.62, x: 20, y: 24 })

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card animate-fadeUp">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <IconWorkflow className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Flujo de automatización</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-pingDot" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Activo
                </span>
              </div>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
                Cada recordatorio que ve el cliente es el resultado de este proceso, ejecutándose solo,
                día y noche. Detrás de un simple mensaje hay reglas de segmentación, plazos, generación
                de enlaces de pago, verificación automática y escalamiento.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { n: '21', l: 'nodos' },
              { n: '6', l: 'integraciones' },
              { n: '3', l: 'canales' },
              { n: '1', l: 'respaldo automático' },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center">
                <div className="text-lg font-extrabold leading-none text-slate-800 tnum">{s.n}</div>
                <div className="mt-0.5 text-[10px] font-medium text-slate-400">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Integraciones conectadas */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <span className="mr-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            <IconPlug className="w-4 h-4" /> Integraciones
          </span>
          {[
            { t: 'ERP contable', c: 'bg-brand-50 text-brand-700' },
            { t: 'WhatsApp Business API', c: 'bg-emerald-50 text-emerald-700' },
            { t: 'Pasarela de pagos', c: 'bg-violet-50 text-violet-700' },
            { t: 'Base de datos', c: 'bg-slate-100 text-slate-600' },
            { t: 'Notificaciones', c: 'bg-rose-50 text-rose-700' },
          ].map((i) => (
            <span key={i.t} className={`rounded-lg px-2.5 py-1 text-xs font-medium ${i.c}`}>
              {i.t}
            </span>
          ))}
        </div>
      </div>

      {/* Editor estilo n8n */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card animate-fadeUp" style={{ animationDelay: '80ms' }}>
        {/* Barra superior del editor */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <IconWorkflow className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-semibold text-slate-700">Cobranza automatizada · Indumatic</span>
            <span className="hidden rounded-md bg-white px-2 py-0.5 text-[11px] text-slate-400 ring-1 ring-slate-200 sm:inline">
              v3 · producción
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="hidden items-center gap-1.5 md:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Última ejecución hace 12 min · 132 mensajes hoy
            </span>
          </div>
        </div>

        {/* Lienzo */}
        <div
          ref={viewportRef}
          className="relative flow-grid h-[560px] w-full cursor-grab overflow-hidden select-none active:cursor-grabbing"
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
        >
          <div
            className="absolute left-0 top-0 origin-top-left"
            style={{
              width: GRAPH_W,
              height: GRAPH_H,
              transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
            }}
          >
            {/* Conexiones */}
            <svg
              className="pointer-events-none absolute left-0 top-0"
              width={GRAPH_W}
              height={GRAPH_H}
              style={{ overflow: 'visible' }}
            >
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0 0L10 5L0 10z" fill="#94a3b8" />
                </marker>
                {Object.entries(ACCENTS).map(([k, c]) => (
                  <marker key={k} id={`arrow-${k}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0 0L10 5L0 10z" fill={c} />
                  </marker>
                ))}
              </defs>
              {EDGES.map((e, i) => {
                const d = edgePath(e)
                const color = e.accent ? ACCENTS[e.accent] : '#94a3b8'
                const marker = e.accent ? `url(#arrow-${e.accent})` : 'url(#arrow)'
                return (
                  <g key={i}>
                    <path
                      d={d}
                      fill="none"
                      stroke={color}
                      strokeWidth={e.loop ? 2 : 2.4}
                      strokeOpacity={e.loop ? 0.55 : 0.9}
                      markerEnd={marker}
                      strokeDasharray={e.loop || e.fallback ? '7 7' : undefined}
                    />
                    {!e.loop && !e.fallback && (
                      <path d={d} fill="none" stroke={color} strokeWidth={2.4} strokeOpacity={0.5} className="flow-dash" />
                    )}
                  </g>
                )
              })}
            </svg>

            {/* Etiquetas de conexión */}
            {EDGES.filter((e) => e.label).map((e, i) => {
              const pos = edgeLabelPos(e)
              const BG = {
                emerald: 'bg-emerald-500',
                rose: 'bg-rose-500',
                amber: 'bg-amber-500',
                blue: 'bg-brand-600',
              }
              const bg = BG[e.accent] || 'bg-slate-400'
              return (
                <span
                  key={i}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-sm ${bg}`}
                  style={{ left: pos.x, top: pos.y }}
                >
                  {e.label}
                </span>
              )
            })}

            {/* Nodos */}
            {NODES.map((n) => (
              <FlowNode key={n.id} node={n} />
            ))}
          </div>

          {/* Controles de zoom */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-xl border border-slate-200 bg-white/95 p-1 shadow-md backdrop-blur">
            <button onClick={() => zoom(-0.15)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100" aria-label="Alejar">
              <IconMinus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-xs font-semibold text-slate-500 tnum">{Math.round(view.scale * 100)}%</span>
            <button onClick={() => zoom(0.15)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100" aria-label="Acercar">
              <IconPlus className="w-4 h-4" />
            </button>
            <div className="mx-0.5 h-5 w-px bg-slate-200" />
            <button onClick={fit} className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100" aria-label="Ajustar">
              <IconMaximize className="w-4 h-4" />
            </button>
          </div>

          {/* Ayuda de paneo */}
          <div className="pointer-events-none absolute bottom-4 right-4 rounded-lg bg-slate-900/70 px-3 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur">
            Arrastre para mover · use +/− para acercar
          </div>

          {/* Leyenda */}
          <div className="absolute right-4 top-4 hidden rounded-xl border border-slate-200 bg-white/95 p-3 shadow-md backdrop-blur lg:block">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">Tipos de nodo</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {Object.entries(TIPOS).map(([k, t]) => (
                <div key={k} className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded ${t.chip}`} />
                  <span className="text-[11px] text-slate-500">{t.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resumen en 4 pasos (para no técnicos) */}
      <div>
        <div className="mb-3 flex items-center gap-2 px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">En resumen</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: '1', t: 'Detecta y prioriza', d: 'Cada día revisa las facturas y calcula la mora de cada cliente automáticamente.' },
            { n: '2', t: 'Decide a quién y cómo', d: 'Segmenta empresas vs. informales y elige el tono y el momento del mensaje.' },
            { n: '3', t: 'Contacta y cobra', d: 'Envía el recordatorio por WhatsApp con un enlace de pago listo para usar.' },
            { n: '4', t: 'Verifica y escala', d: 'Confirma el pago solo, actualiza la cartera y avisa al analista si hace falta.' },
          ].map((s, i) => (
            <div
              key={s.n}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card animate-fadeUp"
              style={{ animationDelay: `${120 + i * 70}ms` }}
            >
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                {s.n}
              </div>
              <div className="mt-3 text-sm font-bold text-slate-800">{s.t}</div>
              <div className="mt-1 text-[13px] leading-relaxed text-slate-500">{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ DOCUMENTACIÓN PASO A PASO ============ */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card md:p-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-brand-500">
            <IconWorkflow className="w-4 h-4" /> Documentación del flujo
          </div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
            Cómo funciona, paso a paso
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Cada nodo del diagrama de arriba, explicado en detalle. Detrás de un simple mensaje de
            WhatsApp hay 18 pasos coordinados: segmentación, cálculo de mora, generación de enlaces de
            pago, verificación automática y escalamiento. Este es todo el proceso.
          </p>
        </div>

        {/* Fases */}
        <div className="mt-8 space-y-9">
          {DOC_PHASES.map((fase) => (
            <section key={fase.letra}>
              {/* Encabezado de fase */}
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-600 text-sm font-extrabold text-white">
                  {fase.letra}
                </span>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-800">{fase.nombre}</h3>
                  <p className="text-xs text-slate-400">{fase.resumen}</p>
                </div>
              </div>

              {/* Nodos de la fase */}
              <div className={fase.nodos.length === 1 ? '' : 'grid gap-3 md:grid-cols-2'}>
                {fase.nodos.map((nodo) => (
                  <NodeDocCard key={nodo.n} nodo={nodo} />
                ))}
              </div>

              {/* Extra para la fase de cadencia */}
              {fase.cadencia && (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <CadenceMini tipoKey="Empresa" accent="brand" />
                  <CadenceMini tipoKey="Informal" accent="amber" />
                </div>
              )}

              {/* Callout del ciclo tras la fase H */}
              {fase.letra === 'H' && (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-500 text-lg text-white">
                    🔁
                  </span>
                  <div>
                    <div className="text-[13.5px] font-bold text-amber-800">Ciclo de reintento</div>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-amber-800/80">
                      Si aún quedan pasos de la cadencia, el flujo <strong>vuelve al nodo ⑩</strong> para
                      programar y enviar el siguiente recordatorio en su fecha. Es la flecha curva
                      punteada (“Reintentar”) del diagrama: insistir con criterio, sin cansarse nunca.
                    </p>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>

      {/* Reglas de negocio + Dónde verlo en la demo */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <IconShield className="w-4 h-4 text-brand-500" /> Reglas de negocio clave
          </h3>
          <div className="mt-4 space-y-3">
            {REGLAS.map((r) => (
              <div key={r.t} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                  <IconCheck className="w-3.5 h-3.5" />
                </span>
                <div>
                  <span className="text-[13.5px] font-semibold text-slate-700">{r.t}. </span>
                  <span className="text-[13px] text-slate-500">{r.d}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <IconWorkflow className="w-4 h-4 text-brand-500" /> Dónde verlo en esta demo
          </h3>
          <div className="mt-4 space-y-2.5">
            {DEMO_MAP.map((d) => (
              <div key={d.p} className="rounded-lg bg-slate-50 p-3">
                <div className="text-[13px] font-semibold text-slate-700">{d.p}</div>
                <div className="mt-0.5 text-[12.5px] text-slate-500">{d.q}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Qué datos viajan por el flujo */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <IconDatabase className="w-4 h-4 text-brand-500" /> Qué datos viajan por el flujo
        </h3>
        <p className="mt-1 text-[13px] text-slate-500">
          Cada factura avanza como un “paquete” de datos que se enriquece en cada nodo.
        </p>
        <div className="mt-4 overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-2.5 pr-4">Campo</th>
                <th className="py-2.5 pr-4">Se agrega en</th>
                <th className="py-2.5">Ejemplo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {DATOS.map((d) => (
                <tr key={d.campo}>
                  <td className="py-2.5 pr-4 font-mono text-[12px] text-slate-600">{d.campo}</td>
                  <td className="py-2.5 pr-4 text-slate-500">{d.fase}</td>
                  <td className="py-2.5 text-slate-500">{d.ej}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
