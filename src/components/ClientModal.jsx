import { useEffect } from 'react'
import { construirConversacion, formatMoney, iniciales } from '../utils'
import { EstadoBadge, TipoBadge } from './Badges'
import {
  IconX,
  IconCheckDouble,
  IconClock,
  IconCard,
  IconSend,
  IconShield,
  IconWhatsApp,
} from './icons'

// Botón "link de pago" dentro de una burbuja
function BotonPago({ cliente, onPagar }) {
  return (
    <button
      onClick={() => onPagar(cliente)}
      className="mt-2 flex w-full items-center gap-2.5 rounded-lg bg-white/95 px-3 py-2.5 text-left shadow-sm ring-1 ring-black/5 transition hover:bg-white hover:shadow-md active:scale-[0.99]"
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-600 text-white">
        <IconCard className="w-4 h-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-bold text-brand-700">Pagar factura</span>
        <span className="block truncate text-[11px] text-slate-500">
          {formatMoney(cliente.monto)} · Pago seguro
        </span>
      </span>
      <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </button>
  )
}

function BurbujaSaliente({ msg, cliente, onPagar }) {
  if (!msg.enviado) {
    // Mensaje programado (aún no enviado)
    return (
      <div className="flex justify-end animate-bubbleIn">
        <div className="relative max-w-[80%] rounded-2xl rounded-tr-sm border border-dashed border-slate-300 bg-white/70 px-3 py-2 shadow-sm">
          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            <IconClock className="w-3 h-3" />
            Programado · {msg.fechaChip}
          </div>
          <p className="whitespace-pre-line text-[13.5px] leading-relaxed text-slate-500">{msg.texto}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-end animate-bubbleIn">
      <div className="relative max-w-[82%] rounded-2xl rounded-tr-sm bg-wa-bubble px-3 py-2 shadow-sm">
        <p className="whitespace-pre-line text-[13.5px] leading-relaxed text-slate-800">{msg.texto}</p>
        {msg.conBotonPago && <BotonPago cliente={cliente} onPagar={onPagar} />}
        <div className="mt-1 flex items-center justify-end gap-1">
          <span className="text-[10px] text-slate-500/80 tnum">{msg.hora}</span>
          <IconCheckDouble className="w-4 h-4 text-wa-tick" />
        </div>
      </div>
    </div>
  )
}

function BurbujaEntrante({ msg }) {
  return (
    <div className="flex justify-start animate-bubbleIn">
      <div className="relative max-w-[82%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 shadow-sm">
        <p className="whitespace-pre-line text-[13.5px] leading-relaxed text-slate-800">{msg.texto}</p>
        <div className="mt-1 flex items-center justify-end gap-1">
          <span className="text-[10px] text-slate-400 tnum">{msg.hora}</span>
        </div>
      </div>
    </div>
  )
}

export default function ClientModal({ cliente, onClose, onPagar }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!cliente) return null
  const mensajes = construirConversacion(cliente)

  // Agrupamos por fecha para mostrar separadores
  let ultimaFecha = null

  return (
    <div className="fixed inset-0 z-40">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-brand-950/40 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-wa-bg shadow-panel animate-slideInRight">
        {/* Encabezado estilo WhatsApp */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-wa-header to-wa-headerLight px-4 py-3 text-white">
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-white/90 transition hover:bg-white/10"
            aria-label="Cerrar"
          >
            <IconX className="w-5 h-5" />
          </button>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/20 text-sm font-bold">
            {iniciales(cliente.cliente)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[15px] font-semibold">{cliente.cliente}</div>
            <div className="flex items-center gap-1.5 text-[11px] text-white/80">
              <IconWhatsApp className="w-3 h-3" />
              {cliente.telefono}
            </div>
          </div>
        </div>

        {/* Barra de contexto de la factura */}
        <div className="flex items-center justify-between gap-2 border-b border-black/5 bg-white px-4 py-2.5">
          <div className="flex items-center gap-2">
            <TipoBadge tipo={cliente.tipo} />
            <span className="font-mono text-xs text-slate-500">{cliente.factura}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-bold text-slate-800 tnum">{formatMoney(cliente.monto)}</span>
            <EstadoBadge estado={cliente.estado} />
          </div>
        </div>

        {/* Cuerpo del chat */}
        <div className="wa-pattern flex-1 space-y-2 overflow-y-auto scrollbar-thin px-4 py-4">
          {/* Aviso de cifrado */}
          <div className="mx-auto mb-2 max-w-[85%] rounded-lg bg-[#fdf6cf] px-3 py-1.5 text-center text-[11px] leading-snug text-amber-800/90 shadow-sm">
            <IconShield className="mr-1 inline w-3 h-3" />
            Secuencia automática de Indumatic · Cobranza. Los mensajes se envían por WhatsApp.
          </div>

          {mensajes.map((msg) => {
            const chip = msg.fechaChip
            const mostrarFecha = chip && chip !== ultimaFecha
            ultimaFecha = chip
            return (
              <div key={msg.id} className="space-y-2">
                {mostrarFecha && (
                  <div className="flex justify-center py-1">
                    <span className="rounded-md bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 shadow-sm">
                      {chip}
                    </span>
                  </div>
                )}
                {msg.entrante ? (
                  <>
                    <BurbujaEntrante msg={msg} />
                    {msg.pagoConfirmado && (
                      <div className="flex justify-center py-1">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
                          <IconCard className="w-3.5 h-3.5" />
                          Pago confirmado · {formatMoney(msg.monto)}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <BurbujaSaliente msg={msg} cliente={cliente} onPagar={onPagar} />
                )}
              </div>
            )
          })}
        </div>

        {/* Barra de entrada simulada */}
        <div className="flex items-center gap-2 border-t border-black/5 bg-[#f0f2f5] px-3 py-2.5">
          <div className="flex-1 rounded-full bg-white px-4 py-2 text-[13px] text-slate-400">
            Secuencia gestionada automáticamente…
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-wa-headerLight text-white shadow-sm transition hover:bg-wa-header">
            <IconSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
