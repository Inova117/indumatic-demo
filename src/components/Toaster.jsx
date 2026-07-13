import { IconWhatsApp, IconCheck } from './icons'
import { formatMoney } from '../utils'

export default function Toaster({ toasts }) {
  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 flex w-[340px] max-w-[calc(100vw-2rem)] flex-col gap-2.5">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-start gap-3 rounded-xl border border-slate-200/70 bg-white p-3 shadow-toast animate-toastIn"
        >
          {t.tipo === 'pago' ? (
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <IconCheck className="w-5 h-5" />
            </div>
          ) : (
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-wa-green/15 text-wa-headerLight">
              <IconWhatsApp className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-800">
              {t.tipo === 'pago' ? 'Pago recibido' : 'Recordatorio enviado'}
            </div>
            <div className="truncate text-[13px] text-slate-500">{t.text}</div>
            {t.tipo === 'pago' && t.monto != null && (
              <div className="mt-0.5 text-sm font-bold text-emerald-600 tnum">
                + {formatMoney(t.monto)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
