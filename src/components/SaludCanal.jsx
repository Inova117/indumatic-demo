import { IconWhatsApp, IconMail, IconShield, IconCheck, IconArrowDown } from './icons'

// ---------------------------------------------------------------------------
//  Salud del número de WhatsApp — el sistema la vigila y se AUTO-PROTEGE.
//  Si la calidad baja, deja de enviar por WhatsApp y sigue cobrando por email.
//  El número nunca llega a morir, porque el sistema no lo deja llegar.
// ---------------------------------------------------------------------------

const ESTADOS = {
  verde: {
    label: 'Alta calidad',
    desc: 'WhatsApp activo · el canal de mejor conversión',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-200',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    barra: 'bg-emerald-500',
    ancho: '92%',
  },
  amarillo: {
    label: 'Calidad en riesgo',
    desc: 'WhatsApp pausado automáticamente · enviando por email',
    dot: 'bg-amber-500',
    ring: 'ring-amber-200',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    barra: 'bg-amber-500',
    ancho: '48%',
  },
}

export default function SaludCanal({ salud, onSimular, onRestablecer }) {
  const e = ESTADOS[salud.estado] || ESTADOS.verde
  const enRiesgo = salud.estado !== 'verde'

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${e.bg} ${e.text}`}>
            <IconShield className="w-[22px] h-[22px]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Salud del número de WhatsApp</h3>
            <p className="text-xs text-slate-500">Protección automática del canal</p>
          </div>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${e.bg} ${e.text} ${e.ring}`}
        >
          <span className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full rounded-full ${e.dot} animate-pingDot`} />
            <span className={`relative inline-flex h-2 w-2 rounded-full ${e.dot}`} />
          </span>
          {e.label}
        </span>
      </div>

      {/* Barra de calidad */}
      <div className="mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-700 ${e.barra}`}
            style={{ width: e.ancho }}
          />
        </div>
        <p className={`mt-2 text-[12.5px] font-medium ${enRiesgo ? 'text-amber-700' : 'text-slate-500'}`}>
          {e.desc}
        </p>
      </div>

      {/* Señales que Meta observa */}
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Entregados</div>
          <div className="mt-0.5 text-base font-bold text-slate-800 tnum">{salud.entregados.toLocaleString('en-US')}</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Bloqueos</div>
          <div className={`mt-0.5 text-base font-bold tnum ${enRiesgo ? 'text-red-600' : 'text-slate-800'}`}>
            {salud.bloqueos}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Bajas</div>
          <div className="mt-0.5 text-base font-bold text-slate-800 tnum">{salud.bajas}</div>
        </div>
      </div>

      {/* Acción automática del sistema */}
      <div
        className={`mt-4 flex items-start gap-2.5 rounded-xl px-3 py-2.5 ${
          enRiesgo ? 'bg-amber-50 ring-1 ring-inset ring-amber-200' : 'bg-emerald-50'
        }`}
      >
        <span
          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white ${
            enRiesgo ? 'bg-amber-500' : 'bg-emerald-500'
          }`}
        >
          {enRiesgo ? <IconArrowDown className="w-3.5 h-3.5" /> : <IconCheck className="w-3.5 h-3.5" />}
        </span>
        {enRiesgo ? (
          <p className="text-[12.5px] leading-relaxed text-amber-900">
            <span className="font-bold">El sistema frenó WhatsApp solo.</span> Los recordatorios siguen
            saliendo <span className="inline-flex items-center gap-1 font-semibold"><IconMail className="w-3.5 h-3.5" />por email</span>.
            La cobranza no se detiene y el número no se quema.
          </p>
        ) : (
          <p className="text-[12.5px] leading-relaxed text-emerald-900">
            <span className="font-bold">Protección activa.</span> Si los bloqueos suben, el sistema pausa
            WhatsApp automáticamente y continúa por email.
          </p>
        )}
      </div>

      {/* Control de demostración */}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <span className="text-[11px] text-slate-400">Demostración</span>
        {enRiesgo ? (
          <button
            onClick={onRestablecer}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-emerald-600"
          >
            <IconWhatsApp className="w-3.5 h-3.5" />
            Restablecer calidad
          </button>
        ) : (
          <button
            onClick={onSimular}
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-[12px] font-semibold text-amber-700 transition hover:bg-amber-100"
          >
            Simular bloqueos de clientes
          </button>
        )}
      </div>
    </div>
  )
}
