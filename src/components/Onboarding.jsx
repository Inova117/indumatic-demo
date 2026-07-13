import { useEffect, useState, useCallback } from 'react'
import {
  IconWorkflow,
  IconPlay,
  IconX,
  IconChevronRight,
  IconChevronLeft,
  IconCheck,
} from './icons'

// ---------------------------------------------------------------------------
//  Pasos del recorrido guiado
//  section: a qué pantalla cambiar · target: elemento [data-tour] a resaltar
// ---------------------------------------------------------------------------
const STEPS = [
  {
    section: 'cartera',
    target: 'sidebar',
    titulo: 'Tu menú de navegación',
    que: 'Desde aquí llegas a cada parte del sistema: tu cartera, la actividad en vivo, las reglas de cobro y los reportes.',
    ayuda: 'Todo tu proceso de cobranza en un solo lugar, siempre a un clic.',
  },
  {
    section: 'cartera',
    target: 'cards',
    titulo: 'Tu cartera de un vistazo',
    que: 'Cuánto te deben en total, cuántos clientes están en mora, cuánto has recuperado este mes y en cuántos días cobras en promedio.',
    ayuda: 'Indumatic deja de adivinar: sabe al instante dónde está su plata, sin abrir un Excel.',
  },
  {
    section: 'cartera',
    target: 'run',
    titulo: 'El botón que cobra por ti',
    que: 'Con un clic, el sistema le escribe por WhatsApp a todos los clientes en mora — y verás la cartera vencida bajar en vivo.',
    ayuda: 'Reemplaza semanas de llamadas una por una. Nadie de tu equipo levanta el teléfono.',
  },
  {
    section: 'cartera',
    target: 'table',
    titulo: 'Cada factura, con su estado',
    que: 'El detalle de toda tu cartera. Haz clic en cualquier cliente para ver su conversación de WhatsApp y su pago.',
    ayuda: 'Todo el historial de cobranza de cada cliente, ordenado — nada se pierde ni se olvida.',
  },
  {
    section: 'actividad',
    target: 'nav-actividad',
    titulo: 'El sistema trabajando en vivo',
    que: 'Un feed en tiempo real de cada recordatorio, pago y acción, más una bandeja con los casos que necesitan a una persona.',
    ayuda: 'Funciona solo 24/7; tu cobrador solo atiende lo difícil, no lo repetitivo.',
  },
  {
    section: 'segmentacion',
    target: 'nav-segmentacion',
    titulo: 'A cada cliente como corresponde',
    que: 'Reglas distintas para clientes empresa e informales: cuándo escribirles y con qué tono.',
    ayuda: 'Persigue mejor a los clientes informales de Indumatic, que son los que más se atrasan.',
  },
  {
    section: 'automatizacion',
    target: 'nav-automatizacion',
    titulo: 'Todo el proceso, por dentro',
    que: 'El flujo completo que corre detrás de cada mensaje: segmentar, calcular la mora, enviar, cobrar, verificar y escalar.',
    ayuda: 'No es un simple chatbot: es un proceso de cobranza completo y automático.',
  },
  {
    section: 'reportes',
    target: 'nav-reportes',
    titulo: 'Los resultados de la gestión',
    que: 'Cuánto se recuperó, cuántos recordatorios se enviaron y cómo evoluciona tu cobranza mes a mes.',
    ayuda: 'Ves en números el retorno del sistema, sin armar reportes a mano.',
  },
  {
    section: 'cartera',
    target: null,
    titulo: '¡Listo! Ya conoces Cobranza',
    que: 'Ese es el recorrido completo. Ahora explora a tu ritmo: prueba el botón “Ejecutar recordatorios” o abre cualquier cliente.',
    ayuda: 'Cobranza automática de punta a punta, pensada para cómo cobra Indumatic.',
    final: true,
  },
]

const M = 16
const CW = 372
const CH = 300

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

export default function Onboarding({ setSection, onClose }) {
  const [started, setStarted] = useState(false)
  const [i, setI] = useState(0)
  const [rect, setRect] = useState(null)

  const total = STEPS.length
  const step = STEPS[i]

  // Medir y posicionar el foco sobre el elemento objetivo
  useEffect(() => {
    if (!started) return
    const s = STEPS[i]
    setSection(s.section)

    let raf = 0
    let to = 0

    const measure = () => {
      if (!s.target) {
        setRect(null)
        return
      }
      const el = document.querySelector(`[data-tour="${s.target}"]`)
      if (!el) {
        setRect(null)
        return
      }
      el.scrollIntoView({ block: 'center', inline: 'nearest' })
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        if (r.width < 4 || r.height < 4) {
          setRect(null)
        } else {
          setRect({ top: r.top, left: r.left, width: r.width, height: r.height, bottom: r.bottom, right: r.right })
        }
      })
    }

    to = setTimeout(measure, 190)
    const onChange = () => measure()
    window.addEventListener('resize', onChange)
    window.addEventListener('scroll', onChange, true)
    return () => {
      clearTimeout(to)
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onChange)
      window.removeEventListener('scroll', onChange, true)
    }
  }, [started, i, setSection])

  const next = useCallback(() => {
    setI((v) => (v < total - 1 ? v + 1 : v))
  }, [total])
  const prev = useCallback(() => setI((v) => Math.max(0, v - 1)), [])
  const begin = useCallback(() => {
    setI(0)
    setStarted(true)
  }, [])

  // Teclado
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (!started) return
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [started, next, prev, onClose])

  // ---- Pantalla de bienvenida (Start) --------------------------------------
  if (!started) {
    return (
      <div className="fixed inset-0 z-[80] grid place-items-center p-4">
        <div className="absolute inset-0 bg-brand-950/70 backdrop-blur-sm animate-fadeIn" />
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-fadeUp">
          <div className="bg-gradient-to-br from-brand-700 to-brand-950 px-7 pb-7 pt-8 text-center text-white">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
              <IconWorkflow className="w-7 h-7" />
            </div>
            <h2 className="mt-4 text-xl font-bold">Bienvenido a Indumatic · Cobranza</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-brand-100/90">
              Te mostramos en 2 minutos, paso a paso, qué hace cada parte del sistema y cómo le ayuda
              a Indumatic a cobrar solo.
            </p>
          </div>
          <div className="px-7 py-6">
            <div className="flex items-center justify-center gap-6 text-center">
              {['Conoce cada sección', 'Descubre qué hace', 'Empieza a usarlo'].map((t, idx) => (
                <div key={t} className="flex-1">
                  <div className="mx-auto grid h-7 w-7 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                    {idx + 1}
                  </div>
                  <div className="mt-1.5 text-[11px] leading-tight text-slate-500">{t}</div>
                </div>
              ))}
            </div>
            <button
              onClick={begin}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-wa-green py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-emerald-500/50"
            >
              <IconPlay className="w-4 h-4" />
              Iniciar recorrido
            </button>
            <button
              onClick={onClose}
              className="mt-2 w-full rounded-xl py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
            >
              Explorar por mi cuenta
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ---- Recorrido con foco --------------------------------------------------
  const centered = !rect
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const pad = 8

  let cardStyle
  if (centered) {
    cardStyle = { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }
  } else {
    const tall = rect.height > vh * 0.5
    let left, top
    if (tall) {
      left = Math.min(rect.right + M, vw - CW - M)
      top = clamp(rect.top, M, vh - CH - M)
    } else {
      const below = rect.bottom + CH + M < vh
      top = below ? rect.bottom + M : Math.max(M, rect.top - CH - M)
      left = clamp(rect.left, M, vw - CW - M)
    }
    cardStyle = { left, top }
  }

  return (
    <div className="fixed inset-0 z-[80]">
      {/* Bloqueador de clics */}
      <div className={`absolute inset-0 ${centered ? 'bg-brand-950/70 backdrop-blur-sm' : ''}`} />

      {/* Foco (spotlight) sobre el objetivo */}
      {!centered && (
        <div
          className="pointer-events-none absolute rounded-xl transition-all duration-300 ease-out"
          style={{
            top: rect.top - pad,
            left: rect.left - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
            boxShadow: '0 0 0 9999px rgba(11, 24, 48, 0.72), 0 0 0 3px rgba(37, 211, 102, 0.9)',
          }}
        />
      )}

      {/* Tarjeta explicativa */}
      <div
        className="absolute w-[372px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl bg-white shadow-2xl animate-fadeUp"
        style={cardStyle}
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-4">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-500">
            {step.final ? 'Fin del recorrido' : `Paso ${i + 1} de ${total - 1}`}
          </span>
          <button
            onClick={onClose}
            className="-mr-1.5 -mt-1 grid h-7 w-7 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Cerrar recorrido"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 pb-3">
          <h3 className="text-[17px] font-bold leading-snug text-slate-900">{step.titulo}</h3>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-500">{step.que}</p>

          <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-emerald-50 px-3 py-2.5">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
              <IconCheck className="w-3.5 h-3.5" />
            </span>
            <p className="text-[13px] leading-relaxed text-emerald-900">
              <span className="font-semibold">Cómo ayuda a Indumatic: </span>
              {step.ayuda}
            </p>
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? 'w-4 bg-brand-600' : 'w-1.5 bg-slate-200'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {i > 0 && (
              <button
                onClick={prev}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-[13px] font-semibold text-slate-500 transition hover:bg-slate-100"
              >
                <IconChevronLeft className="w-4 h-4" />
                Atrás
              </button>
            )}
            {step.final ? (
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-2 text-[13px] font-bold text-white shadow-sm transition hover:bg-emerald-600"
              >
                Empezar a explorar
              </button>
            ) : (
              <button
                onClick={next}
                className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3.5 py-2 text-[13px] font-bold text-white shadow-sm transition hover:bg-brand-700"
              >
                Siguiente
                <IconChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
