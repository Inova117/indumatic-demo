import { IconBuilding, IconUser, IconCheck, IconWhatsApp, IconMail } from './icons'

// ---- Badge de canal de contacto --------------------------------------------
export function CanalBadge({ canal, motivo }) {
  if (canal === 'whatsapp') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
        <IconWhatsApp className="w-3.5 h-3.5 text-[#25d366]" />
        WhatsApp
      </span>
    )
  }
  return (
    <span
      title={motivo || 'Email'}
      className="inline-flex items-center gap-1.5 rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-200"
    >
      <IconMail className="w-3.5 h-3.5 text-brand-500" />
      Email
    </span>
  )
}

// ---- Badge de estado -------------------------------------------------------
const ESTADO_STYLES = {
  'Al día': {
    dot: 'bg-emerald-500',
    cls: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  },
  'Por vencer': {
    dot: 'bg-amber-500',
    cls: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  },
  Vencido: {
    dot: 'bg-red-500',
    cls: 'bg-red-50 text-red-700 ring-red-600/20',
  },
  'En gestión': {
    dot: 'bg-brand-500',
    cls: 'bg-brand-50 text-brand-700 ring-brand-600/20',
    pulse: true,
  },
  Pagado: {
    dot: 'bg-emerald-500',
    cls: 'bg-emerald-500 text-white ring-emerald-600/20',
    solid: true,
  },
}

export function EstadoBadge({ estado }) {
  const s = ESTADO_STYLES[estado] || ESTADO_STYLES['Al día']
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset transition-all duration-300 ${s.cls}`}
    >
      {s.solid ? (
        <IconCheck className="w-3.5 h-3.5" />
      ) : (
        <span className="relative flex h-2 w-2">
          {s.pulse && (
            <span className={`absolute inline-flex h-full w-full rounded-full ${s.dot} animate-pingDot`} />
          )}
          <span className={`relative inline-flex h-2 w-2 rounded-full ${s.dot}`} />
        </span>
      )}
      {estado}
    </span>
  )
}

// ---- Badge de tipo de cliente ----------------------------------------------
export function TipoBadge({ tipo }) {
  if (tipo === 'Empresa') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
        <IconBuilding className="w-3.5 h-3.5 text-slate-400" />
        Empresa
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
      <IconUser className="w-3.5 h-3.5 text-amber-500" />
      Informal
    </span>
  )
}
