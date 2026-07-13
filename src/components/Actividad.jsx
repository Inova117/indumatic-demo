import { useEffect, useRef, useState, useCallback } from 'react'
import { clientesIniciales } from '../mockData'
import { formatMoney, iniciales } from '../utils'
import AnimatedNumber from './AnimatedNumber'
import {
  IconWhatsApp,
  IconCard,
  IconCheck,
  IconBell,
  IconClock,
  IconWorkflow,
  IconActivity,
  IconPause,
  IconPlay,
  IconPhone,
  IconArrowUp,
} from './icons'

// ---------------------------------------------------------------------------
//  Configuración de eventos del feed
// ---------------------------------------------------------------------------
const EVENT_TYPES = {
  recordatorio: { w: 32, icon: IconWhatsApp, chip: 'bg-[#25d366]', bar: 'bg-emerald-400', label: 'Recordatorio' },
  apertura: { w: 16, icon: IconCard, chip: 'bg-brand-500', bar: 'bg-brand-400', label: 'Enlace abierto' },
  pago: { w: 18, icon: IconCheck, chip: 'bg-emerald-500', bar: 'bg-emerald-500', label: 'Pago' },
  comprobante: { w: 8, icon: IconWhatsApp, chip: 'bg-teal-500', bar: 'bg-teal-400', label: 'Comprobante' },
  plan: { w: 9, icon: IconWorkflow, chip: 'bg-violet-500', bar: 'bg-violet-400', label: 'Plan de pagos' },
  promesa: { w: 9, icon: IconClock, chip: 'bg-amber-500', bar: 'bg-amber-400', label: 'Promesa de pago' },
  escalado: { w: 8, icon: IconBell, chip: 'bg-rose-500', bar: 'bg-rose-400', label: 'Escalamiento' },
}

const RAZONES = [
  '3 recordatorios sin respuesta',
  'Prometió pagar y no cumplió',
  'Solicitó plan de pagos',
  'Monto alto · requiere gestión',
  'Sin contacto por WhatsApp',
  'Disputa el monto de la factura',
]

const ESCALACIONES_INI = [
  { id: 'e1', cliente: 'Taller Mecánico El Rayo', tipo: 'Informal', dias: 90, monto: 780, razon: '3 recordatorios sin respuesta', estado: 'Pendiente' },
  { id: 'e2', cliente: 'José Cabrera — Ferretería', tipo: 'Informal', dias: 65, monto: 1250, razon: 'Prometió pagar y no cumplió', estado: 'Pendiente' },
  { id: 'e3', cliente: 'Textiles Ecuador S.A.', tipo: 'Empresa', dias: 45, monto: 3900, razon: 'Solicitó plan de pagos', estado: 'Pendiente' },
  { id: 'e4', cliente: 'Metalúrgica Sur C.A.', tipo: 'Empresa', dias: 20, monto: 5400, razon: 'Monto alto · requiere gestión', estado: 'Pendiente' },
  { id: 'e5', cliente: 'Servicios Industriales Vera', tipo: 'Informal', dias: 35, monto: 1950, razon: 'Sin contacto por WhatsApp', estado: 'Pendiente' },
]

function pickType() {
  const entries = Object.entries(EVENT_TYPES)
  const total = entries.reduce((s, [, e]) => s + e.w, 0)
  let r = Math.random() * total
  for (const [k, e] of entries) {
    if ((r -= e.w) < 0) return k
  }
  return 'recordatorio'
}

function randCliente() {
  return clientesIniciales[Math.floor(Math.random() * clientesIniciales.length)]
}

function fmtHora(mins) {
  const m = ((mins % 1440) + 1440) % 1440
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

function buildEvent(k, hora, id) {
  const cli = randCliente()
  const nombre = cli.cliente
  let text = ''
  let sub = ''
  let monto = null
  switch (k) {
    case 'recordatorio':
      text = `Recordatorio enviado a ${nombre}`
      sub = `WhatsApp · ${cli.factura}`
      break
    case 'apertura':
      text = `${nombre} abrió el enlace de pago`
      sub = 'Pasarela de pagos'
      break
    case 'pago':
      text = `Pago recibido · ${nombre}`
      sub = cli.factura
      monto = cli.monto
      break
    case 'comprobante':
      text = `Comprobante enviado · ${nombre}`
      sub = 'WhatsApp · confirmación'
      break
    case 'plan':
      text = `Plan de pagos aceptado · ${nombre}`
      sub = `3 cuotas de ${formatMoney(cli.monto / 3)}`
      break
    case 'promesa':
      text = `Promesa de pago · ${nombre}`
      sub = 'Se compromete a pagar esta semana'
      break
    case 'escalado':
      text = `Escalado a analista · ${nombre}`
      sub = 'Sin respuesta a la cadencia'
      break
    default:
      break
  }
  return { id, k, text, sub, monto, hora, cliente: nombre, tipo: cli.tipo, dias: 30, montoRaw: cli.monto }
}

function FeedRow({ ev }) {
  const cfg = EVENT_TYPES[ev.k]
  const Icon = cfg.icon
  return (
    <div className="relative flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2.5 animate-fadeUp">
      <span className={`absolute left-0 top-2 bottom-2 w-1 rounded-full ${cfg.bar}`} />
      <div className={`ml-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white ${cfg.chip}`}>
        <Icon className="w-[18px] h-[18px]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13.5px] font-semibold text-slate-800">{ev.text}</div>
        <div className="truncate text-[11.5px] text-slate-400">{ev.sub}</div>
      </div>
      {ev.monto != null && (
        <div className="shrink-0 text-sm font-bold text-emerald-600 tnum">+{formatMoney(ev.monto)}</div>
      )}
      <div className="shrink-0 text-[11px] font-medium text-slate-400 tnum">{ev.hora}</div>
    </div>
  )
}

function StatTile({ icon: Icon, wrap, value, label, delay }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card animate-fadeUp" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center gap-2.5">
        <div className={`grid h-9 w-9 place-items-center rounded-lg ${wrap}`}>
          <Icon className="w-[18px] h-[18px]" />
        </div>
        <div className="text-[22px] font-extrabold leading-none tracking-tight text-slate-900 tnum">{value}</div>
      </div>
      <div className="mt-2 text-[12px] font-medium text-slate-500">{label}</div>
    </div>
  )
}

export default function Actividad() {
  const [events, setEvents] = useState([])
  const [paused, setPaused] = useState(false)
  const [escalaciones, setEscalaciones] = useState(ESCALACIONES_INI)
  const [counters, setCounters] = useState({ mensajes: 132, recuperado: 4120, enlaces: 38 })

  const idRef = useRef(1)
  const simRef = useRef(9 * 60 + 41) // 09:41

  const emitir = useCallback((k) => {
    simRef.current += 1 + Math.floor(Math.random() * 3)
    const ev = buildEvent(k || pickType(), fmtHora(simRef.current), idRef.current++)
    setEvents((prev) => [ev, ...prev].slice(0, 40))
    setCounters((c) => ({
      mensajes: c.mensajes + (ev.k === 'recordatorio' || ev.k === 'comprobante' ? 1 : 0),
      recuperado: c.recuperado + (ev.k === 'pago' ? ev.monto : 0),
      enlaces: c.enlaces + (ev.k === 'apertura' ? 1 : 0),
    }))
    if (ev.k === 'escalado') {
      setEscalaciones((prev) => {
        if (prev.some((x) => x.cliente === ev.cliente) || prev.length >= 7) return prev
        return [
          ...prev,
          {
            id: `e${idRef.current}`,
            cliente: ev.cliente,
            tipo: ev.tipo,
            dias: 20 + Math.floor(Math.random() * 70),
            monto: ev.montoRaw,
            razon: RAZONES[Math.floor(Math.random() * RAZONES.length)],
            estado: 'Pendiente',
            nuevo: true,
          },
        ]
      })
    }
    return ev
  }, [])

  // Semilla inicial + stream en vivo
  useEffect(() => {
    const seed = ['pago', 'recordatorio', 'plan', 'apertura', 'recordatorio', 'promesa']
    seed.forEach((k) => emitir(k))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => emitir(), 2600)
    return () => clearInterval(t)
  }, [paused, emitir])

  const pushEventoSimple = useCallback((text, sub, k = 'plan') => {
    simRef.current += 1
    setEvents((prev) =>
      [{ id: idRef.current++, k, text, sub, monto: null, hora: fmtHora(simRef.current) }, ...prev].slice(0, 40),
    )
  }, [])

  const ofrecerPlan = useCallback(
    (esc) => {
      setEscalaciones((prev) => prev.map((x) => (x.id === esc.id ? { ...x, estado: 'Plan enviado', nuevo: false } : x)))
      pushEventoSimple(`Plan de pagos ofrecido · ${esc.cliente}`, '3 cuotas · enviado por WhatsApp', 'plan')
    },
    [pushEventoSimple],
  )

  const marcarGestionado = useCallback(
    (esc) => {
      setEscalaciones((prev) => prev.filter((x) => x.id !== esc.id))
      pushEventoSimple(`Caso gestionado · ${esc.cliente}`, 'Marcado por el analista', 'comprobante')
    },
    [pushEventoSimple],
  )

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card animate-fadeUp sm:p-6">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <IconActivity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Actividad en vivo</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-600">
                <span className="relative flex h-2 w-2">
                  <span className={`absolute inline-flex h-full w-full rounded-full bg-rose-400 ${paused ? '' : 'animate-pingDot'}`} />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
                </span>
                {paused ? 'En pausa' : 'En vivo'}
              </span>
            </div>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-500">
              El sistema trabaja solo, 24/7. Aquí ve cada acción en tiempo real y los casos que
              necesitan la atención de una persona.
            </p>
          </div>
        </div>
        <button
          onClick={() => setPaused((p) => !p)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          {paused ? <IconPlay className="w-4 h-4" /> : <IconPause className="w-4 h-4" />}
          {paused ? 'Reanudar' : 'Pausar'}
        </button>
      </div>

      {/* Contadores en vivo */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile icon={IconWhatsApp} wrap="bg-emerald-50 text-emerald-500" label="Mensajes enviados hoy" delay={0}
          value={<AnimatedNumber value={counters.mensajes} format={(v) => Math.round(v).toString()} duration={500} />} />
        <StatTile icon={IconCheck} wrap="bg-brand-50 text-brand-500" label="Recuperado hoy" delay={60}
          value={<AnimatedNumber value={counters.recuperado} format={(v) => formatMoney(v)} duration={500} />} />
        <StatTile icon={IconCard} wrap="bg-violet-50 text-violet-500" label="Enlaces de pago abiertos" delay={120}
          value={<AnimatedNumber value={counters.enlaces} format={(v) => Math.round(v).toString()} duration={500} />} />
        <StatTile icon={IconBell} wrap="bg-rose-50 text-rose-500" label="En cola de escalamiento" delay={180}
          value={<AnimatedNumber value={escalaciones.length} format={(v) => Math.round(v).toString()} duration={400} />} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Feed */}
        <div className="lg:col-span-3">
          <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800">Flujo de actividad</h3>
                {!paused && (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                    <span className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-emerald-500" />
                    actualizando
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400">Últimos movimientos</span>
            </div>
            <div className="max-h-[560px] space-y-2 overflow-y-auto scrollbar-thin p-4">
              {events.map((ev) => (
                <FeedRow key={ev.id} ev={ev} />
              ))}
            </div>
          </div>
        </div>

        {/* Escalamientos */}
        <div className="lg:col-span-2">
          <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <IconBell className="w-4 h-4 text-rose-500" />
                  Necesitan atención
                </h3>
                <p className="text-xs text-slate-500">La automatización agotó su gestión</p>
              </div>
              <span className="grid h-7 min-w-7 place-items-center rounded-full bg-rose-100 px-2 text-xs font-bold text-rose-600">
                {escalaciones.length}
              </span>
            </div>
            <div className="max-h-[560px] space-y-3 overflow-y-auto scrollbar-thin p-4">
              {escalaciones.length === 0 && (
                <div className="grid place-items-center py-12 text-center">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                    <IconCheck className="w-6 h-6" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-700">Todo bajo control</p>
                  <p className="text-xs text-slate-400">No hay casos pendientes de gestión.</p>
                </div>
              )}
              {escalaciones.map((esc) => (
                <div
                  key={esc.id}
                  className={`rounded-xl border p-3.5 transition-all ${
                    esc.estado === 'Plan enviado' ? 'border-violet-200 bg-violet-50/40' : 'border-slate-200 bg-white'
                  } ${esc.nuevo ? 'animate-fadeUp' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${
                        esc.tipo === 'Empresa' ? 'bg-gradient-to-br from-brand-400 to-brand-600' : 'bg-gradient-to-br from-amber-400 to-amber-600'
                      }`}
                    >
                      {iniciales(esc.cliente)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13.5px] font-bold text-slate-800">{esc.cliente}</div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[11px]">
                        <span className="font-semibold text-red-600">{esc.dias} d mora</span>
                        <span className="text-slate-300">·</span>
                        <span className="font-bold text-slate-700 tnum">{formatMoney(esc.monto)}</span>
                      </div>
                    </div>
                    {esc.estado === 'Plan enviado' && (
                      <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-600">
                        Plan enviado
                      </span>
                    )}
                  </div>
                  <div className="mt-2.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[12px] text-slate-500">
                    <span className="font-semibold text-slate-600">Motivo: </span>
                    {esc.razon}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => ofrecerPlan(esc)}
                      disabled={esc.estado === 'Plan enviado'}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-violet-500 py-2 text-[12px] font-semibold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                    >
                      <IconWorkflow className="w-3.5 h-3.5" />
                      Ofrecer plan
                    </button>
                    <button
                      onClick={() => marcarGestionado(esc)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      <IconCheck className="w-3.5 h-3.5" />
                      Gestionado
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
