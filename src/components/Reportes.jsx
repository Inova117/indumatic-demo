import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts'
import AnimatedNumber from './AnimatedNumber'
import { formatMoney, formatMoneyShort } from '../utils'
import { recuperadoPorMes, recuperacionPorSegmento, metricasBase } from '../mockData'
import {
  IconTrendDown,
  IconWhatsApp,
  IconShield,
  IconArrowUp,
  IconArrowDown,
  IconBuilding,
  IconUser,
} from './icons'

function KpiCard({ icon: Icon, wrap, label, value, sub, subDir, delay }) {
  return (
    <div
      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card animate-fadeUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${wrap}`}>
        <Icon className="w-[20px] h-[20px]" />
      </div>
      <div className="mt-4 text-[26px] font-extrabold leading-none tracking-tight text-slate-900 tnum">
        {value}
      </div>
      <div className="mt-1.5 text-[13px] font-medium text-slate-500">{label}</div>
      {sub && (
        <div
          className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${
            subDir === 'down' ? 'text-emerald-600' : 'text-emerald-600'
          }`}
        >
          {subDir === 'down' ? <IconArrowDown className="w-3.5 h-3.5" /> : <IconArrowUp className="w-3.5 h-3.5" />}
          {sub}
        </div>
      )}
    </div>
  )
}

function BarTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <div className="text-[11px] font-medium text-slate-400">{payload[0].payload.mes}</div>
      <div className="text-sm font-bold text-slate-800 tnum">{formatMoney(payload[0].value)}</div>
    </div>
  )
}

export default function Reportes({ metrics }) {
  const totalSeg = recuperacionPorSegmento.reduce((s, x) => s + x.valor, 0)

  return (
    <div className="space-y-6">
      {/* Encabezado narrativo */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-r from-brand-700 to-brand-900 p-6 text-white shadow-card animate-fadeUp">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-200">
              Resumen de julio 2026
            </div>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
              La cobranza automática está funcionando
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-brand-100/90">
              Más recuperación, menos mora y una fracción del trabajo manual anterior.
            </p>
          </div>
          <div className="rounded-xl bg-white/10 px-5 py-3 text-center ring-1 ring-white/15">
            <div className="text-3xl font-extrabold tracking-tight tnum">
              <AnimatedNumber value={metrics.recuperadoMes} format={(v) => formatMoney(v)} />
            </div>
            <div className="mt-0.5 text-[11px] font-medium text-brand-100">Recuperado este mes</div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={IconTrendDown}
          wrap="bg-emerald-50 text-emerald-500"
          label="Recuperado este mes"
          value={<AnimatedNumber value={metrics.recuperadoMes} format={(v) => formatMoney(v)} />}
          sub="18% vs mes anterior"
          subDir="up"
          delay={0}
        />
        <KpiCard
          icon={IconWhatsApp}
          wrap="bg-wa-green/15 text-wa-headerLight"
          label="Recordatorios enviados"
          value={<AnimatedNumber value={metrics.recordatoriosEnviados} format={(v) => Math.round(v).toString()} />}
          sub="automáticos, sin llamadas"
          subDir="up"
          delay={70}
        />
        <KpiCard
          icon={IconShield}
          wrap="bg-brand-50 text-brand-500"
          label="Tasa de recuperación"
          value={`${metricasBase.tasaRecuperacion}%`}
          sub="6% vs mes anterior"
          subDir="up"
          delay={140}
        />
        <KpiCard
          icon={IconArrowDown}
          wrap="bg-amber-50 text-amber-500"
          label="Reducción de mora"
          value={`${metricasBase.reduccionMora}%`}
          sub="vs mes anterior"
          subDir="down"
          delay={210}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Recuperado por mes */}
        <div
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card animate-fadeUp lg:col-span-3"
          style={{ animationDelay: '160ms' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Recuperado por mes</h3>
              <p className="text-xs text-slate-500">Últimos 6 meses</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
              <IconArrowUp className="w-3.5 h-3.5" />
              Tendencia al alza
            </span>
          </div>
          <div className="mt-4" style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recuperadoPorMes} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={6} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                  tickFormatter={formatMoneyShort}
                />
                <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(42,103,189,0.06)' }} />
                <Bar dataKey="valor" radius={[6, 6, 0, 0]} maxBarSize={44} isAnimationActive animationDuration={800}>
                  {recuperadoPorMes.map((_, i) => (
                    <Cell key={i} fill={i === recuperadoPorMes.length - 1 ? '#1e4f9c' : '#aecbef'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recuperación por segmento */}
        <div
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card animate-fadeUp lg:col-span-2"
          style={{ animationDelay: '230ms' }}
        >
          <h3 className="text-sm font-bold text-slate-800">Recuperación por segmento</h3>
          <p className="text-xs text-slate-500">Distribución del mes</p>

          <div className="mt-5 space-y-5">
            {recuperacionPorSegmento.map((seg) => {
              const pct = Math.round((seg.valor / totalSeg) * 100)
              const esEmpresa = seg.segmento === 'Empresa'
              const Icon = esEmpresa ? IconBuilding : IconUser
              return (
                <div key={seg.segmento}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Icon className={`w-4 h-4 ${esEmpresa ? 'text-brand-500' : 'text-amber-500'}`} />
                      {seg.segmento}
                    </span>
                    <span className="text-sm font-bold text-slate-800 tnum">{formatMoney(seg.valor)}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        esEmpresa ? 'bg-brand-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-1 text-right text-[11px] text-slate-400">{pct}% del total</div>
                </div>
              )
            })}
          </div>

          {/* Entregas por canal */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <h4 className="text-[13px] font-bold text-slate-800">Recordatorios por canal</h4>
            <div className="mt-3 space-y-2.5">
              {[
                { c: 'WhatsApp', n: 96, pct: 68, color: 'bg-[#25d366]' },
                { c: 'Email', n: 41, pct: 29, color: 'bg-brand-600' },
                { c: 'Respaldo automático', n: 4, pct: 3, color: 'bg-amber-500' },
              ].map((x) => (
                <div key={x.c}>
                  <div className="mb-1 flex items-center justify-between text-[12.5px]">
                    <span className="font-medium text-slate-600">{x.c}</span>
                    <span className="font-bold text-slate-700 tnum">{x.n}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${x.color}`} style={{ width: `${x.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-3.5 text-[12.5px] leading-relaxed text-slate-600">
              4 mensajes de WhatsApp no se entregaron y el sistema los{' '}
              <strong className="text-slate-800">reenvió por email automáticamente</strong>. Ninguna
              factura se quedó sin gestión.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
