import { IconSearch, IconBell, IconHelp } from './icons'

const TITULOS = {
  cartera: { titulo: 'Cartera', sub: 'Estado de cuentas por cobrar en tiempo real' },
  actividad: { titulo: 'Actividad', sub: 'Lo que el sistema hace en vivo, y lo que requiere gestión' },
  segmentacion: { titulo: 'Segmentación', sub: 'Reglas de recordatorios por tipo de cliente' },
  automatizacion: { titulo: 'Automatización', sub: 'El proceso completo que corre detrás de cada recordatorio' },
  reportes: { titulo: 'Reportes', sub: 'Resultados de la gestión de cobranza' },
}

export default function TopBar({ active, onStartTour }) {
  const t = TITULOS[active] || TITULOS.cartera
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/85 px-5 backdrop-blur-md lg:px-8">
      {/* Marca en móvil */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600">
          <svg viewBox="0 0 32 32" className="h-4 w-4">
            <path d="M6 22V11l10-5 10 5v11" fill="none" stroke="white" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-bold tracking-tight text-slate-900">{t.titulo}</h1>
        <p className="hidden truncate text-xs text-slate-500 sm:block">{t.sub}</p>
      </div>

      {/* Buscador simulado */}
      <div className="relative hidden lg:block">
        <IconSearch className="pointer-events-none absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar cliente o factura…"
          className="w-64 rounded-lg border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {/* Guía / recorrido */}
      <button
        onClick={onStartTour}
        className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-[13px] font-semibold text-brand-700 transition hover:bg-brand-100"
      >
        <IconHelp className="w-4 h-4" />
        <span className="hidden sm:inline">Guía</span>
      </button>

      {/* Notificaciones */}
      <button className="relative grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
        <IconBell className="w-5 h-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
      </button>

      {/* Usuario */}
      <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white shadow-sm">
          AC
        </div>
        <div className="hidden leading-tight sm:block">
          <div className="text-sm font-semibold text-slate-800">Ana Cedeño</div>
          <div className="text-[11px] text-slate-500">Analista de Cobranza</div>
        </div>
      </div>
    </header>
  )
}
