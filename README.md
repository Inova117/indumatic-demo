# Indumatic · Cobranza — Demo

Demostración interactiva de un sistema de **cobranza automatizada por WhatsApp**
para Indumatic (automatización industrial · Ecuador · USD).

> ⚠️ **Demo de ventas.** Todos los datos son simulados. No hay backend, base de
> datos ni integraciones reales (WhatsApp / pagos). Todo corre en el navegador.

## Cómo ejecutar

```bash
npm install
npm run dev
```

Luego abra la URL que muestra Vite (por defecto http://localhost:5173).

## Qué mostrar en la demo

1. **Cartera** — dashboard con la cartera vencida, clientes en mora y tendencia.
   - Botón **▶ Ejecutar recordatorios**: envía recordatorios a todos los clientes
     en mora y se ve, en vivo, cómo la cartera vencida baja y la recuperación sube.
   - Clic en cualquier cliente → conversación de WhatsApp automática. El botón
     **Pagar factura** abre un pago simulado que marca la factura como pagada.
2. **Segmentación** — cadencias distintas para clientes Empresa vs. Informales.
3. **Reportes** — resultados del mes (recuperación, recordatorios, tasas).

## Personalización

Todo el contenido está en [`src/mockData.js`](src/mockData.js): clientes,
facturas, montos, fechas, cadencias y métricas.

## Stack

React + Vite · Tailwind CSS · Recharts. Sin backend.
