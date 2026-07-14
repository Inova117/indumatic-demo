import { cadencias } from '../mockData'
import {
  IconBuilding,
  IconUser,
  IconWhatsApp,
  IconCheck,
  IconSegment,
  IconShield,
  IconPhone,
  IconMail,
} from './icons'

const TEMAS = {
  Empresa: {
    icon: IconBuilding,
    accent: 'brand',
    ring: 'ring-brand-100',
    headBg: 'from-brand-500 to-brand-700',
    node: 'bg-brand-600',
    nodeVenc: 'bg-brand-800 ring-brand-200',
    line: 'bg-brand-200',
    chip: 'bg-brand-50 text-brand-700 ring-brand-200',
    dot: 'text-brand-500',
    ejemplo:
      'Estimados de Metalúrgica Sur, les recordamos que la factura F-2026-0471 por $5,400.00 vence el 19 jun 2026. Puede realizar su pago de forma segura en el siguiente enlace:',
  },
  Informal: {
    icon: IconUser,
    accent: 'amber',
    ring: 'ring-amber-100',
    headBg: 'from-amber-500 to-amber-600',
    node: 'bg-amber-500',
    nodeVenc: 'bg-amber-700 ring-amber-200',
    line: 'bg-amber-200',
    chip: 'bg-amber-50 text-amber-700 ring-amber-200',
    dot: 'text-amber-500',
    ejemplo:
      'Hola Don José 👋 Le recordamos que su factura F-2026-0402 por $1,250.00 vence hoy. La puede pagar fácil y rápido aquí 👇',
  },
}

function etiquetaDia(dia) {
  if (dia === 0) return 'Vence'
  return dia < 0 ? `D −${Math.abs(dia)}` : `D +${dia}`
}

function CadenciaCard({ tipoKey }) {
  const cad = cadencias[tipoKey]
  const tema = TEMAS[tipoKey]
  const Icon = tema.icon

  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card ring-1 ${tema.ring}`}>
      {/* Encabezado */}
      <div className={`bg-gradient-to-r ${tema.headBg} px-6 py-5 text-white`}>
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">{cad.nombre}</h3>
            <p className="text-[13px] text-white/85">{cad.descripcion}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            Tono {cad.tono}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            <IconWhatsApp className="w-3.5 h-3.5" />
            {cad.frecuencia}
          </span>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Línea de tiempo de la cadencia */}
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Calendario de recordatorios
        </div>
        <div className="relative flex items-start justify-between pt-2">
          <div className={`absolute left-5 right-5 top-[18px] h-0.5 ${tema.line}`} />
          {cad.pasos.map((paso) => {
            const esVenc = paso.dia === 0
            const esTarea = paso.tipo === 'tarea'
            return (
              <div key={paso.dia} className="relative z-10 flex w-1/4 flex-col items-center px-1 text-center">
                <div
                  className={`grid h-9 w-9 place-items-center rounded-full text-[11px] font-bold text-white shadow-sm ${
                    esTarea ? 'bg-rose-500' : esVenc ? `${tema.nodeVenc} ring-4` : tema.node
                  }`}
                >
                  {esTarea ? <IconPhone className="w-4 h-4" /> : etiquetaDia(paso.dia)}
                </div>
                <div className="mt-2 text-[11px] font-semibold leading-tight text-slate-700">
                  {paso.etiqueta}
                </div>
                {esTarea && (
                  <div className="mt-0.5 text-[10px] font-medium text-rose-500">Persona, no mensaje</div>
                )}
              </div>
            )
          })}
        </div>

        {/* Reglas */}
        <div className="mt-6 space-y-2.5">
          {cad.pasos.map((paso) => (
            <div key={paso.dia} className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-[11px] font-bold shadow-sm ${tema.dot}`}>
                {paso.dia === 0 ? '0' : paso.dia < 0 ? `−${Math.abs(paso.dia)}` : `+${paso.dia}`}
              </span>
              <span className="flex-1 text-[13px] font-medium text-slate-700">{paso.etiqueta}</span>
              <span className="text-[11px] text-slate-400">
                {paso.dia < 0 ? 'antes de vencer' : paso.dia === 0 ? 'día de vencimiento' : `${paso.dia} días de mora`}
              </span>
            </div>
          ))}
        </div>

        {/* Ejemplo de mensaje */}
        <div className="mt-5">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Ejemplo de mensaje
          </div>
          <div className="flex justify-end">
            <div className="max-w-[92%] rounded-2xl rounded-tr-sm bg-wa-bubble px-3.5 py-2.5 text-[13px] leading-relaxed text-slate-800 shadow-sm">
              {tema.ejemplo}
              <div className="mt-1.5 flex justify-end">
                <span className="text-[10px] text-slate-500/80">09:12 ✓✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Segmentacion() {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card animate-fadeUp">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <IconSegment className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Segmentación inteligente de cobranza</h2>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-500">
              El sistema adapta automáticamente la frecuencia y el tono de los recordatorios según el
              tipo de cliente. Las <strong className="text-slate-700">empresas</strong> reciben una
              comunicación formal y espaciada; los{' '}
              <strong className="text-slate-700">clientes informales</strong> —los que más se atrasan—
              reciben mensajes más cercanos y frecuentes.
            </p>
          </div>
        </div>
      </div>

      {/* Perfiles */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="animate-fadeUp" style={{ animationDelay: '80ms' }}>
          <CadenciaCard tipoKey="Empresa" />
        </div>
        <div className="animate-fadeUp" style={{ animationDelay: '160ms' }}>
          <CadenciaCard tipoKey="Informal" />
        </div>
      </div>

      {/* Canales y respaldo — el motor no depende de un solo canal */}
      <div
        className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card animate-fadeUp"
        style={{ animationDelay: '200ms' }}
      >
        <div className="border-b border-slate-100 px-6 py-5">
          <h3 className="text-base font-bold text-slate-900">Canales y respaldo automático</h3>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-500">
            WhatsApp es el canal que mejor convierte, pero <strong className="text-slate-700">no es el
            producto</strong>. Si un cliente no autorizó WhatsApp, o si un mensaje no se entrega, el motor
            cambia de canal solo. El cobro nunca se detiene.
          </p>
        </div>

        <div className="grid grid-cols-1 divide-y divide-slate-100 md:grid-cols-3 md:divide-x md:divide-y-0">
          <div className="p-5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#25d366] text-white">
                <IconWhatsApp className="w-5 h-5" />
              </span>
              <div>
                <div className="text-sm font-bold text-slate-800">WhatsApp</div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
                  Canal principal
                </div>
              </div>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
              Mejor tasa de lectura y de pago. Requiere que el cliente lo haya autorizado y que la salud
              del número esté en verde.
            </p>
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white">
                <IconMail className="w-5 h-5" />
              </span>
              <div>
                <div className="text-sm font-bold text-slate-800">Email</div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
                  Siempre disponible
                </div>
              </div>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
              Sin autorizaciones ni dependencia de plataformas externas. Lleva el mismo enlace de pago.
              Es la red de seguridad del sistema.
            </p>
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-rose-500 text-white">
                <IconPhone className="w-5 h-5" />
              </span>
              <div>
                <div className="text-sm font-bold text-slate-800">Persona</div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-rose-500">
                  Solo lo difícil
                </div>
              </div>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
              El escalamiento <strong className="text-slate-700">no es un mensaje conminatorio</strong>:
              es una tarea de llamada para el analista. El tono duro nunca va por WhatsApp.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-slate-100 bg-slate-50 px-6 py-3.5 text-[13px] text-slate-600">
          <span className="font-semibold text-slate-700">Regla del motor:</span>
          <span className="rounded-md bg-white px-2 py-0.5 font-medium text-emerald-700 ring-1 ring-emerald-200">
            ¿Autorizó WhatsApp y el número está sano?
          </span>
          <span className="text-slate-400">→ WhatsApp.</span>
          <span className="rounded-md bg-white px-2 py-0.5 font-medium text-brand-700 ring-1 ring-brand-200">
            ¿No, o el envío falló?
          </span>
          <span className="text-slate-400">→ Email, automáticamente.</span>
        </div>
      </div>

      {/* Reglas de contacto responsable */}
      <div
        className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card animate-fadeUp"
        style={{ animationDelay: '220ms' }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <IconShield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Reglas de contacto responsable</h3>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
                El sistema respeta por diseño los límites que la normativa ecuatoriana fija para la
                gestión de cobro. Ninguna cadencia puede saltárselos.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <IconCheck className="w-3.5 h-3.5" />
            Aplicado automáticamente
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { t: 'Horario permitido', d: 'Solo entre 07h00 y 20h00.' },
            { t: 'Frecuencia máxima', d: 'Un mensaje al día por el mismo medio.' },
            { t: 'Días no hábiles', d: 'Nunca fines de semana ni feriados.' },
            { t: 'Número identificable', d: 'Siempre desde la línea oficial de la empresa.' },
            { t: 'Sin contacto a terceros', d: 'Solo al deudor, codeudor o garante.' },
            { t: 'Sin presión indebida', d: 'Tono cordial; nunca amenazante ni humillante.' },
          ].map((r) => (
            <div key={r.t} className="flex items-start gap-2.5 rounded-xl bg-slate-50 px-3.5 py-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
                <IconCheck className="w-3.5 h-3.5" />
              </span>
              <div>
                <div className="text-[13px] font-semibold text-slate-800">{r.t}</div>
                <div className="text-[12.5px] leading-relaxed text-slate-500">{r.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Beneficio */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { t: 'Menos trabajo manual', d: 'Sin llamadas una por una. El sistema contacta a todos a la vez.' },
          { t: 'El tono correcto', d: 'Formal con empresas, cercano con clientes informales.' },
          { t: 'Cobro más rápido', d: 'Recordatorios antes de vencer reducen la mora desde el inicio.' },
        ].map((b, i) => (
          <div
            key={b.t}
            className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card animate-fadeUp"
            style={{ animationDelay: `${240 + i * 70}ms` }}
          >
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <IconCheck className="w-4 h-4" />
            </span>
            <div>
              <div className="text-sm font-bold text-slate-800">{b.t}</div>
              <div className="mt-0.5 text-[13px] leading-relaxed text-slate-500">{b.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
