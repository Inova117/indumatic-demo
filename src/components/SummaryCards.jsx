import AnimatedNumber from './AnimatedNumber'
import { formatMoney } from '../utils'
import {
  IconWallet,
  IconUsers,
  IconArrowUp,
  IconArrowDown,
  IconClock,
  IconTrendDown,
} from './icons'

function Card({ icon: Icon, iconWrap, label, children, trend, trendDir, delay }) {
  return (
    <div
      className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cardHover animate-fadeUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${iconWrap}`}>
          <Icon className="w-[22px] h-[22px]" />
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
              trendDir === 'down'
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            {trendDir === 'down' ? <IconArrowDown className="w-3.5 h-3.5" /> : <IconArrowUp className="w-3.5 h-3.5" />}
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-[28px] font-extrabold leading-none tracking-tight text-slate-900 tnum">
          {children}
        </div>
        <div className="mt-1.5 text-[13px] font-medium text-slate-500">{label}</div>
      </div>
    </div>
  )
}

export default function SummaryCards({ metrics }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card
        icon={IconWallet}
        iconWrap="bg-red-50 text-red-500"
        label="Cartera vencida total"
        trend="12%"
        trendDir="down"
        delay={0}
      >
        <AnimatedNumber value={metrics.carteraVencida} format={(v) => formatMoney(v)} />
      </Card>

      <Card
        icon={IconUsers}
        iconWrap="bg-amber-50 text-amber-500"
        label="Clientes en mora"
        trend="8%"
        trendDir="down"
        delay={70}
      >
        <AnimatedNumber value={metrics.clientesEnMora} format={(v) => Math.round(v).toString()} />
      </Card>

      <Card
        icon={IconTrendDown}
        iconWrap="bg-emerald-50 text-emerald-500"
        label="Recuperado este mes"
        trend="18%"
        trendDir="up"
        delay={140}
      >
        <AnimatedNumber value={metrics.recuperadoMes} format={(v) => formatMoney(v)} />
      </Card>

      <Card
        icon={IconClock}
        iconWrap="bg-brand-50 text-brand-500"
        label="Días promedio de cobro"
        trend="4 días"
        trendDir="down"
        delay={210}
      >
        <AnimatedNumber value={metrics.diasPromedio} format={(v) => Math.round(v).toString()} />
      </Card>
    </div>
  )
}
