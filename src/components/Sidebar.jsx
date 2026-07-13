import { IconWallet, IconSegment, IconReport, IconShield, IconWorkflow, IconActivity } from './icons'

const NAV = [
  { id: 'cartera', label: 'Cartera', icon: IconWallet, desc: 'Dashboard' },
  { id: 'actividad', label: 'Actividad', icon: IconActivity, desc: 'En vivo' },
  { id: 'segmentacion', label: 'Segmentación', icon: IconSegment, desc: 'Cadencias' },
  { id: 'automatizacion', label: 'Automatización', icon: IconWorkflow, desc: 'Flujo' },
  { id: 'reportes', label: 'Reportes', icon: IconReport, desc: 'Resultados' },
]

export default function Sidebar({ active, onChange }) {
  return (
    <aside data-tour="sidebar" className="hidden md:flex w-64 shrink-0 flex-col bg-brand-950 text-slate-300">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/5">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 shadow-lg shadow-brand-950/50">
          <svg viewBox="0 0 32 32" className="h-5 w-5">
            <path d="M6 22V11l10-5 10 5v11" fill="none" stroke="white" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="16" cy="16.5" r="2.8" fill="#25d366" />
          </svg>
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-bold text-white tracking-tight">Indumatic</div>
          <div className="text-[11px] font-medium text-brand-300">Cobranza</div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-brand-400/70">
          Menú
        </div>
        {NAV.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              data-tour={`nav-${item.id}`}
              onClick={() => onChange(item.id)}
              className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-950/40'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-6 -translate-y-1/2 w-1 rounded-r-full bg-wa-green" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-brand-300 group-hover:text-white'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              <span className={`text-[10px] ${isActive ? 'text-brand-100/80' : 'text-brand-400/60'}`}>
                {item.desc}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Estado del sistema */}
      <div className="px-3 pb-5">
        <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-pingDot" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-semibold text-white">Sistema activo</span>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-brand-200/70">
            Recordatorios automáticos por WhatsApp funcionando en tiempo real.
          </p>
        </div>
        <div className="mt-3 flex items-center gap-2 px-2 text-[11px] text-brand-300/60">
          <IconShield className="w-3.5 h-3.5" />
          Pagos con enlace seguro
        </div>
      </div>
    </aside>
  )
}
