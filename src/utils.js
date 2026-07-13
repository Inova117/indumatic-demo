import { HOY, cadencias } from './mockData'

const MESES = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
]

const MS_DIA = 1000 * 60 * 60 * 24

// ---- Moneda: $1,250.00 -----------------------------------------------------
const fmtUSD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatMoney(n) {
  return fmtUSD.format(Number(n) || 0)
}

// Versión compacta para ejes de gráficos: $48k
export function formatMoneyShort(n) {
  const v = Number(n) || 0
  if (Math.abs(v) >= 1000) return '$' + (v / 1000).toFixed(v % 1000 === 0 ? 0 : 1) + 'k'
  return '$' + v.toFixed(0)
}

// ---- Fechas ----------------------------------------------------------------
function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

// "02 jul 2026"
export function formatDate(iso) {
  const d = parseISO(iso)
  const dia = String(d.getUTCDate()).padStart(2, '0')
  return `${dia} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

// Chip de fecha para el chat: "Hoy", "Ayer" o "2 jul"
export function formatChatDate(iso) {
  const d = parseISO(iso)
  const hoy = parseISO(HOY)
  const diff = Math.round((hoy - d) / MS_DIA)
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  const dia = String(d.getUTCDate()).padStart(2, '0')
  return `${dia} ${MESES[d.getUTCMonth()]}`
}

// Días de mora respecto a HOY (positivo = vencido)
export function diasMora(iso) {
  const vence = parseISO(iso)
  const hoy = parseISO(HOY)
  return Math.round((hoy - vence) / MS_DIA)
}

// Suma N días a una fecha ISO y devuelve ISO
export function addDays(iso, n) {
  const d = parseISO(iso)
  d.setUTCDate(d.getUTCDate() + n)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// ---- Estados ---------------------------------------------------------------
export const ESTADOS = ['Al día', 'Por vencer', 'Vencido', 'En gestión', 'Pagado']

// Estados que forman parte de la "cartera vencida" (deuda pendiente vencida)
export const ESTADOS_MORA = ['Vencido', 'En gestión']

export function esEnMora(estado) {
  return ESTADOS_MORA.includes(estado)
}

// ---- Secuencia de WhatsApp por cliente -------------------------------------
// Construye la conversación automática según el segmento y la mora del cliente.
export function construirConversacion(cli) {
  const cad = cadencias[cli.tipo]
  const mora = diasMora(cli.vence)
  const nombre = cli.nombreCorto
  const monto = formatMoney(cli.monto)
  const fecha = formatDate(cli.vence)

  const mensajes = cad.pasos.map((paso, i) => {
    const enviado = mora >= paso.dia
    const fechaEnvio = addDays(cli.vence, paso.dia)
    const texto = textoMensaje(cli.tipo, i, { nombre, monto, fecha, factura: cli.factura, dia: paso.dia })
    return {
      id: `${cli.id}-${i}`,
      dia: paso.dia,
      etiqueta: paso.etiqueta,
      enviado,
      fechaEnvio,
      fechaChip: formatChatDate(fechaEnvio),
      hora: HORAS[i],
      texto,
      conBotonPago: paso.tipo !== 'escalado',
    }
  })

  // Si el cliente ya pagó, agregamos su respuesta de confirmación.
  if (cli.estado === 'Pagado') {
    const ultimoEnviado = [...mensajes].reverse().find((m) => m.enviado) || mensajes[0]
    mensajes.push({
      id: `${cli.id}-pago`,
      entrante: true,
      fechaChip: ultimoEnviado.fechaChip,
      hora: sumarMinutos(ultimoEnviado.hora, 42),
      texto:
        cli.tipo === 'Informal'
          ? '¡Listo! Ya realicé el pago 🙌 Gracias por el aviso.'
          : 'Confirmamos el pago de la factura. Quedamos atentos, gracias.',
      pagoConfirmado: true,
      monto: cli.monto,
    })
  }

  return mensajes
}

const HORAS = ['09:12', '08:05', '10:26', '16:41']

function sumarMinutos(hhmm, min) {
  const [h, m] = hhmm.split(':').map(Number)
  const total = h * 60 + m + min
  const hh = String(Math.floor(total / 60) % 24).padStart(2, '0')
  const mm = String(total % 60).padStart(2, '0')
  return `${hh}:${mm}`
}

// Plantillas de mensaje. i: 0=pre, 1=vencimiento, 2=firme, 3=escalado
function textoMensaje(tipo, i, { nombre, monto, fecha, factura, dia }) {
  const diasTexto = Math.abs(dia)
  if (tipo === 'Empresa') {
    switch (i) {
      case 0:
        return `Estimados de ${nombre}, les recordamos cordialmente que la factura ${factura} por ${monto} vence el ${fecha}. Puede realizar su pago de forma segura en el siguiente enlace:`
      case 1:
        return `Estimados, la factura ${factura} por ${monto} vence el día de hoy. Agradecemos gestionar el pago a través del siguiente enlace:`
      case 2:
        return `Estimados, la factura ${factura} registra ${diasTexto} días de vencimiento. Agradecemos regularizar el pago a la brevedad posible:`
      default:
        return `Estimados de ${nombre}, la factura ${factura} presenta ${diasTexto} días de mora. Solicitamos comunicarse con nuestro Departamento de Cobranzas para coordinar el pago o un plan de pagos.`
    }
  }
  // Informal — tono cercano
  switch (i) {
    case 0:
      return `Hola ${nombre} 👋 Le recordamos que su factura ${factura} por ${monto} vence el ${fecha}. La puede pagar fácil y rápido aquí:`
    case 1:
      return `Hola ${nombre}, su factura ${factura} por ${monto} vence hoy. Puede pagarla en un clic aquí 👇`
    case 2:
      return `Hola ${nombre}, su factura ${factura} ya tiene ${diasTexto} días de mora. Le agradecemos ponerse al día con su pago 🙏`
    default:
      return `${nombre}, su factura ${factura} tiene ${diasTexto} días de mora. Por favor comuníquese con nosotros para coordinar el pago o un plan de pagos. Estamos para ayudarle.`
  }
}

// Iniciales para avatares
export function iniciales(nombre) {
  const limpio = nombre.replace(/[^\p{L}\s]/gu, ' ').trim()
  const partes = limpio.split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[1][0]).toUpperCase()
}
