import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
} from 'recharts'
import { historicoCartera, metricasBase } from '../mockData'
import { formatMoney, formatMoneyShort } from '../utils'
import { IconTrendDown } from './icons'

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <div className="text-[11px] font-medium text-slate-400">{payload[0].payload.semana}</div>
      <div className="text-sm font-bold text-slate-800 tnum">{formatMoney(payload[0].value)}</div>
    </div>
  )
}

export default function CarteraChart({ carteraVencida }) {
  const data = [...historicoCartera, { semana: 'Hoy', valor: Math.round(carteraVencida) }]
  const primero = historicoCartera[0].valor
  const reduccion = Math.round(((primero - carteraVencida) / primero) * 100)

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Cartera vencida</h3>
          <p className="text-xs text-slate-500">Últimas semanas</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
          <IconTrendDown className="w-3.5 h-3.5" />
          {reduccion}% ↓
        </span>
      </div>

      <div className="mt-4 flex-1" style={{ minHeight: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="carteraFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2a67bd" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#2a67bd" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
            <XAxis
              dataKey="semana"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              width={48}
              tickFormatter={formatMoneyShort}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#c7d2e5', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="valor"
              stroke="#1e4f9c"
              strokeWidth={2.5}
              fill="url(#carteraFill)"
              dot={{ r: 3, fill: '#1e4f9c', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#1e4f9c', stroke: '#fff', strokeWidth: 2 }}
              isAnimationActive
              animationDuration={700}
            />
            <ReferenceDot
              x="Hoy"
              y={Math.round(carteraVencida)}
              r={5}
              fill="#25d366"
              stroke="#fff"
              strokeWidth={2}
              isFront
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <span className="text-slate-500">Meta trimestral</span>
        <span className="font-semibold text-slate-700 tnum">{formatMoney(12000)}</span>
      </div>
    </div>
  )
}
