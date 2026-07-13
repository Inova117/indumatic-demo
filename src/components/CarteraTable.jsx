import { EstadoBadge, TipoBadge } from './Badges'
import { formatMoney, formatDate, iniciales } from '../utils'
import { IconWhatsApp } from './icons'

function MoraCell({ mora, estado }) {
  if (estado === 'Pagado') {
    return <span className="text-sm text-slate-300">—</span>
  }
  if (mora > 0) {
    const color = mora >= 15 ? 'text-red-600' : 'text-amber-600'
    return <span className={`text-sm font-semibold tnum ${color}`}>{mora} d</span>
  }
  if (mora === 0) {
    return <span className="text-sm font-semibold text-amber-600">Vence hoy</span>
  }
  return <span className="text-sm text-slate-400 tnum">{mora} d</span>
}

export default function CarteraTable({ clientes, onRowClick, flashSet }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Detalle de cartera</h3>
          <p className="text-xs text-slate-500">{clientes.length} facturas · clic para ver la conversación</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <IconWhatsApp className="w-4 h-4 text-wa-headerLight" />
          Recordatorios por WhatsApp
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[880px] text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3">Cliente</th>
              <th className="px-3 py-3">Tipo</th>
              <th className="px-3 py-3">Factura</th>
              <th className="px-3 py-3 text-right">Monto</th>
              <th className="px-3 py-3">Vence</th>
              <th className="px-3 py-3 text-center">Mora</th>
              <th className="px-3 py-3 pr-5">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {clientes.map((c) => {
              const flashing = flashSet.has(c.id)
              return (
                <tr
                  key={c.id}
                  onClick={() => onRowClick(c)}
                  className={`group cursor-pointer transition-colors duration-150 hover:bg-brand-50/40 ${
                    flashing ? 'animate-flash' : ''
                  }`}
                >
                  {/* Cliente */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${
                          c.tipo === 'Empresa'
                            ? 'bg-gradient-to-br from-brand-400 to-brand-600'
                            : 'bg-gradient-to-br from-amber-400 to-amber-600'
                        }`}
                      >
                        {iniciales(c.cliente)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-800 group-hover:text-brand-700">
                          {c.cliente}
                        </div>
                        <div className="truncate text-xs text-slate-400">{c.industria}</div>
                      </div>
                    </div>
                  </td>
                  {/* Tipo */}
                  <td className="px-3 py-3.5">
                    <TipoBadge tipo={c.tipo} />
                  </td>
                  {/* Factura */}
                  <td className="px-3 py-3.5">
                    <span className="font-mono text-xs text-slate-500">{c.factura}</span>
                  </td>
                  {/* Monto */}
                  <td className="px-3 py-3.5 text-right">
                    <span className="text-sm font-bold text-slate-800 tnum">{formatMoney(c.monto)}</span>
                  </td>
                  {/* Vence */}
                  <td className="px-3 py-3.5">
                    <span className="whitespace-nowrap text-sm text-slate-500">{formatDate(c.vence)}</span>
                  </td>
                  {/* Mora */}
                  <td className="px-3 py-3.5 text-center">
                    <MoraCell mora={c.diasMora} estado={c.estado} />
                  </td>
                  {/* Estado */}
                  <td className="px-3 py-3.5 pr-5">
                    <EstadoBadge estado={c.estado} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
