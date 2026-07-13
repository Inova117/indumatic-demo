import { useState, useEffect } from 'react'
import { formatMoney } from '../utils'
import { IconX, IconShield, IconCard, IconCheck, IconWhatsApp } from './icons'

export default function PaymentModal({ cliente, onClose, onPaid }) {
  const [fase, setFase] = useState('form') // form | processing | success

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && fase !== 'processing' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, fase])

  useEffect(() => {
    if (fase !== 'processing') return
    const t = setTimeout(() => {
      setFase('success')
      onPaid && onPaid(cliente)
    }, 1700)
    return () => clearTimeout(t)
  }, [fase, cliente, onPaid])

  if (!cliente) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-brand-950/60 backdrop-blur-sm animate-fadeIn"
        onClick={() => fase !== 'processing' && onClose()}
      />

      <div className="relative w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-2xl animate-fadeUp">
        {/* Encabezado */}
        <div className="relative bg-gradient-to-br from-brand-700 to-brand-900 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/15">
                <svg viewBox="0 0 32 32" className="h-4 w-4">
                  <path d="M6 22V11l10-5 10 5v11" fill="none" stroke="white" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-sm font-bold">Indumatic · Pagos</div>
            </div>
            {fase !== 'processing' && (
              <button
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full text-white/80 transition hover:bg-white/10"
                aria-label="Cerrar"
              >
                <IconX className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-brand-100">
            <IconShield className="w-3.5 h-3.5" />
            Conexión segura · cifrado SSL
          </div>
        </div>

        {fase === 'success' ? (
          <div className="px-6 py-8 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <IconCheck className="w-9 h-9" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">¡Pago realizado!</h3>
            <p className="mt-1 text-sm text-slate-500">
              Factura {cliente.factura} de {cliente.cliente}
            </p>
            <div className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 tnum">
              {formatMoney(cliente.monto)}
            </div>
            <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-[13px] font-medium text-emerald-700">
              <IconWhatsApp className="w-4 h-4" />
              Comprobante enviado por WhatsApp
            </div>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Listo
            </button>
          </div>
        ) : (
          <div className="px-6 py-5">
            {/* Resumen de factura */}
            <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Factura</span>
                <span className="font-mono text-slate-700">{cliente.factura}</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-sm">
                <span className="text-slate-500">Cliente</span>
                <span className="max-w-[60%] truncate font-medium text-slate-700">{cliente.cliente}</span>
              </div>
              <div className="mt-3 flex items-end justify-between border-t border-slate-200 pt-3">
                <span className="text-sm font-medium text-slate-500">Total a pagar</span>
                <span className="text-2xl font-extrabold tracking-tight text-slate-900 tnum">
                  {formatMoney(cliente.monto)}
                </span>
              </div>
            </div>

            {/* Formulario de tarjeta (demostración) */}
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Número de tarjeta</label>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="4242 4242 4242 4242"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-12 text-sm text-slate-700 tnum outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                  <IconCard className="absolute right-3 top-1/2 w-5 h-5 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">Vencimiento</label>
                  <input
                    type="text"
                    defaultValue="09/28"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-700 tnum outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">CVV</label>
                  <input
                    type="text"
                    defaultValue="123"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-700 tnum outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setFase('processing')}
              disabled={fase === 'processing'}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600 disabled:opacity-70"
            >
              {fase === 'processing' ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Procesando pago…
                </>
              ) : (
                <>Pagar {formatMoney(cliente.monto)}</>
              )}
            </button>
            <p className="mt-3 text-center text-[11px] text-slate-400">
              Demostración — no se procesa ningún pago real.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
