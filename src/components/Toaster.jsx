import { IconWhatsApp, IconCheck, IconMail, IconShield } from './icons'
import { formatMoney } from '../utils'

const TIPOS = {
  whatsapp: {
    titulo: 'Recordatorio enviado',
    sub: 'por WhatsApp',
    wrap: 'bg-wa-green/15 text-wa-headerLight',
    Icon: IconWhatsApp,
  },
  email: {
    titulo: 'Recordatorio enviado',
    sub: 'por Email',
    wrap: 'bg-brand-50 text-brand-600',
    Icon: IconMail,
  },
  fallback: {
    titulo: 'WhatsApp no entregado',
    sub: 'reenviado por Email automáticamente',
    wrap: 'bg-amber-50 text-amber-600',
    Icon: IconMail,
  },
  pago: {
    titulo: 'Pago recibido',
    wrap: 'bg-emerald-100 text-emerald-600',
    Icon: IconCheck,
  },
  alerta: {
    titulo: 'Protección automática',
    wrap: 'bg-amber-100 text-amber-600',
    Icon: IconShield,
  },
}

export default function Toaster({ toasts }) {
  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 flex w-[350px] max-w-[calc(100vw-2rem)] flex-col gap-2.5">
      {toasts.map((t) => {
        const cfg = TIPOS[t.tipo] || TIPOS.whatsapp
        const Icon = cfg.Icon
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-white p-3 shadow-toast animate-toastIn ${
              t.tipo === 'fallback' || t.tipo === 'alerta'
                ? 'border-amber-200'
                : 'border-slate-200/70'
            }`}
          >
            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${cfg.wrap}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-800">{cfg.titulo}</div>
              <div className="truncate text-[13px] text-slate-500">{t.text}</div>

              {cfg.sub && (
                <div
                  className={`mt-0.5 text-[11.5px] font-medium ${
                    t.tipo === 'fallback' ? 'text-amber-600' : 'text-slate-400'
                  }`}
                >
                  {cfg.sub}
                </div>
              )}
              {t.motivo && (
                <div className="mt-0.5 text-[11.5px] text-slate-400">{t.motivo}</div>
              )}
              {t.tipo === 'pago' && t.monto != null && (
                <div className="mt-0.5 text-sm font-bold text-emerald-600 tnum">
                  + {formatMoney(t.monto)}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
