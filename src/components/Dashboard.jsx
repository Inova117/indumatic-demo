import SummaryCards from './SummaryCards'
import CarteraChart from './CarteraChart'
import CarteraTable from './CarteraTable'
import { IconPlay, IconWhatsApp, IconLightning } from './icons'

function RunButton({ onRun, running }) {
  return (
    <button
      data-tour="run"
      onClick={onRun}
      disabled={running}
      className={`group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 ${
        running
          ? 'cursor-not-allowed bg-emerald-600/90 shadow-emerald-600/20'
          : 'bg-gradient-to-r from-emerald-500 to-wa-green shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 active:translate-y-0'
      }`}
    >
      {running ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Enviando recordatorios…
        </>
      ) : (
        <>
          <IconPlay className="w-4 h-4" />
          Ejecutar recordatorios
        </>
      )}
      {!running && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      )}
    </button>
  )
}

export default function Dashboard({ clientes, metrics, onRun, running, onRowClick, flashSet }) {
  return (
    <div className="space-y-6">
      {/* Banner de acción — el momento clave de la demo */}
      <div className="relative overflow-hidden rounded-2xl border border-brand-200/50 bg-gradient-to-br from-brand-800 to-brand-950 p-5 shadow-card animate-fadeUp sm:p-6">
        <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-wa-green/10 blur-2xl" />
        <div className="pointer-events-none absolute right-24 top-6 h-24 w-24 rounded-full bg-brand-400/10 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-wa-green/20 text-wa-green ring-1 ring-wa-green/30">
              <IconLightning className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Campaña de recordatorios</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-brand-100">
                  <IconWhatsApp className="w-3 h-3" />
                  WhatsApp
                </span>
              </div>
              <p className="mt-1 max-w-lg text-[13px] leading-relaxed text-brand-100/80">
                Envíe recordatorios automáticos a todos los clientes en mora con un clic. Observe cómo
                la cartera vencida se reduce en tiempo real.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <RunButton onRun={onRun} running={running} />
          </div>
        </div>
      </div>

      {/* Tarjetas resumen */}
      <div data-tour="cards">
        <SummaryCards metrics={metrics} />
      </div>

      {/* Gráfico + nota */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2" data-tour="table">
          <CarteraTable clientes={clientes} onRowClick={onRowClick} flashSet={flashSet} />
        </div>
        <div className="lg:col-span-1">
          <CarteraChart carteraVencida={metrics.carteraVencida} />
        </div>
      </div>
    </div>
  )
}
