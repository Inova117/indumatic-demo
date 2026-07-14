import {
  IconDoc,
  IconCheck,
  IconX,
  IconWhatsApp,
  IconMail,
  IconCard,
  IconDatabase,
  IconPhone,
  IconShield,
} from './icons'

// ---------------------------------------------------------------------------
//  Propuesta para Indumatic — directa, sin discurso de venta.
//  Edite los montos y plazos en las constantes de abajo.
// ---------------------------------------------------------------------------
const PAGOS = [
  { concepto: 'Al arrancar', detalle: 'Confirmación del proyecto', monto: 900 },
  { concepto: 'Entrega Fase 1', detalle: 'Tablero + email + enlace de pago + conciliación', monto: 800 },
  { concepto: 'Entrega final', detalle: 'WhatsApp, escalamiento y reportes', monto: 700 },
]
const TOTAL = PAGOS.reduce((s, p) => s + p.monto, 0)
const MENSUAL = 150
const SEMANAS = 6

function Seccion({ n, titulo, children }) {
  return (
    <section className="border-t border-slate-200 py-8 first:border-t-0 first:pt-0">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[13px] font-bold text-brand-500">{n}</span>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">{titulo}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Punto({ children, tipo = 'si' }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
          tipo === 'si' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'
        }`}
      >
        {tipo === 'si' ? <IconCheck className="w-3.5 h-3.5" /> : <IconX className="w-3 h-3" />}
      </span>
      <span className="text-[15px] leading-relaxed text-slate-700">{children}</span>
    </li>
  )
}

export default function Propuesta() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-card animate-fadeUp sm:p-10">
        {/* Encabezado */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-7">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-500">
              <IconDoc className="w-4 h-4" />
              Propuesta
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Sistema de recordatorios de pago
            </h1>
            <p className="mt-1.5 text-[15px] text-slate-500">
              Preparado para Indumatic · Julio 2026
            </p>
          </div>
          <div className="hidden shrink-0 rounded-xl bg-slate-50 px-4 py-3 text-center ring-1 ring-slate-200 sm:block">
            <div className="text-2xl font-extrabold text-slate-900 tnum">${TOTAL.toLocaleString('en-US')}</div>
            <div className="mt-0.5 text-[11px] font-medium text-slate-400">+ ${MENSUAL}/mes</div>
          </div>
        </div>

        {/* 1 — Qué es */}
        <Seccion n="1" titulo="Qué es">
          <p className="text-[15.5px] leading-relaxed text-slate-700">
            Un sistema que le recuerda automáticamente a sus clientes las facturas que tienen por pagar,
            les da un enlace para pagarlas en un clic, y le muestra a usted el estado de su cartera en
            tiempo real.
          </p>
          <p className="mt-3 text-[15.5px] leading-relaxed text-slate-700">
            Nadie de su equipo tiene que llamar.
          </p>
        </Seccion>

        {/* 2 — Qué hace */}
        <Seccion n="2" titulo="Qué hace, concretamente">
          <ul className="space-y-3">
            <Punto>Lee sus facturas pendientes, desde su sistema contable o desde un archivo.</Punto>
            <Punto>Calcula cuáles están por vencer y cuáles ya están en mora.</Punto>
            <Punto>
              Envía el recordatorio <strong>por WhatsApp</strong> si el cliente lo autorizó, o{' '}
              <strong>por email</strong> si no.
            </Punto>
            <Punto>Incluye un enlace de pago único por factura.</Punto>
            <Punto>
              Cuando el cliente paga, <strong>marca la factura como pagada solo</strong> y actualiza el
              tablero.
            </Punto>
            <Punto>
              Si un mensaje no se entrega, lo <strong>reenvía por el otro canal automáticamente</strong>.
            </Punto>
            <Punto>
              Si se agota la secuencia sin pago, crea una <strong>tarea de llamada</strong> para su
              analista.
            </Punto>
          </ul>
        </Seccion>

        {/* 3 — Qué NO hace */}
        <Seccion n="3" titulo="Qué no hace (para que no haya sorpresas)">
          <ul className="space-y-3">
            <Punto tipo="no">
              <strong>No procesa pagos.</strong> El dinero va directo a su cuenta a través de su pasarela.
              Nosotros solo generamos el enlace y detectamos cuándo se pagó.
            </Punto>
            <Punto tipo="no">
              <strong>No garantiza que todos los mensajes de WhatsApp lleguen.</strong> Meta puede pausar
              envíos. Por eso siempre hay respaldo por email.
            </Punto>
            <Punto tipo="no">
              <strong>No reemplaza a su cobrador.</strong> Le quita lo repetitivo y le deja solo los casos
              difíciles.
            </Punto>
            <Punto tipo="no">
              <strong>No estimamos resultados.</strong> El impacto real se mide con su cartera, en el
              piloto.
            </Punto>
          </ul>
        </Seccion>

        {/* 4 — Qué necesitamos */}
        <Seccion n="4" titulo="Qué necesitamos de Indumatic">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { i: IconDatabase, t: 'Su cartera', d: 'Un Excel con sus facturas pendientes, o acceso a su sistema contable.' },
              { i: IconCard, t: 'Pasarela de pagos', d: 'Cuenta de comercio (PayPhone, Kushki, PagoPlux o la que ya usen).' },
              { i: IconWhatsApp, t: 'Número de WhatsApp', d: 'Un número nuevo, dedicado. No el que usan hoy en el celular.' },
              { i: IconShield, t: 'Autorización de clientes', d: 'Que sus clientes acepten recibir mensajes. Les damos el texto para la orden de compra.' },
              { i: IconMail, t: 'Un subdominio', d: 'Por ejemplo pagos.indumatic.ec, para el enlace de pago.' },
              { i: IconPhone, t: 'Un contacto técnico', d: 'Alguien de su lado que nos dé los accesos cuando haga falta.' },
            ].map((x) => {
              const Icon = x.i
              return (
                <div key={x.t} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-brand-600 shadow-sm">
                    <Icon className="w-[18px] h-[18px]" />
                  </span>
                  <div>
                    <div className="text-[14px] font-bold text-slate-800">{x.t}</div>
                    <div className="mt-0.5 text-[13px] leading-relaxed text-slate-500">{x.d}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </Seccion>

        {/* 5 — Cómo se construye */}
        <Seccion n="5" titulo="Cómo se construye">
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-brand-600 px-2 py-0.5 text-[11px] font-bold text-white">
                  FASE 1
                </span>
                <span className="text-[13px] font-medium text-slate-400">Semanas 1 a 3</span>
              </div>
              <div className="mt-2 text-[15px] font-bold text-slate-800">
                Tablero de cartera, recordatorios por email, enlace de pago y conciliación automática.
              </div>
              <p className="mt-1.5 text-[14px] leading-relaxed text-slate-500">
                Funciona completo sin depender de WhatsApp. Al final de esta fase ya están cobrando
                automáticamente.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white">
                  FASE 2
                </span>
                <span className="text-[13px] font-medium text-slate-400">Semanas 4 a {SEMANAS}</span>
              </div>
              <div className="mt-2 text-[15px] font-bold text-slate-800">
                Se agrega WhatsApp, el escalamiento a su analista y los reportes.
              </div>
              <p className="mt-1.5 text-[14px] leading-relaxed text-slate-500">
                WhatsApp se activa cuando Meta aprueba las plantillas y sus clientes tienen la
                autorización registrada.
              </p>
            </div>
          </div>
        </Seccion>

        {/* 6 — Precio */}
        <Seccion n="6" titulo="Precio">
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3">Pago</th>
                  <th className="px-5 py-3">Cuándo</th>
                  <th className="px-5 py-3 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PAGOS.map((p, i) => (
                  <tr key={p.concepto}>
                    <td className="px-5 py-3.5 text-[14px] font-semibold text-slate-700">
                      <span className="mr-2 font-mono text-slate-400">{i + 1}</span>
                      {p.concepto}
                    </td>
                    <td className="px-5 py-3.5 text-[13.5px] text-slate-500">{p.detalle}</td>
                    <td className="px-5 py-3.5 text-right text-[15px] font-bold text-slate-800 tnum">
                      ${p.monto.toLocaleString('en-US')}
                    </td>
                  </tr>
                ))}
                <tr className="bg-emerald-50">
                  <td className="px-5 py-3.5 text-[14px] font-extrabold text-emerald-800" colSpan={2}>
                    Total de la implementación · {SEMANAS} semanas
                  </td>
                  <td className="px-5 py-3.5 text-right text-lg font-extrabold text-emerald-800 tnum">
                    ${TOTAL.toLocaleString('en-US')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-5 py-4 ring-1 ring-slate-200">
            <div>
              <div className="text-[15px] font-bold text-slate-800">Mantenimiento mensual</div>
              <div className="text-[13px] text-slate-500">
                Hosting, monitoreo, soporte y ajustes. Empieza al entregar la Fase 1.
              </div>
            </div>
            <div className="shrink-0 text-lg font-extrabold text-slate-900 tnum">${MENSUAL}/mes</div>
          </div>

          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="text-[13.5px] font-bold text-amber-900">Costos que van aparte</div>
            <p className="mt-1 text-[13.5px] leading-relaxed text-amber-900/85">
              Indumatic los paga directamente al proveedor, no a nosotros: los{' '}
              <strong>mensajes de WhatsApp</strong> (aprox. USD 0,013 por mensaje) y la{' '}
              <strong>comisión de la pasarela de pagos</strong>, según la que elijan.
            </p>
          </div>

          <p className="mt-4 text-[13.5px] leading-relaxed text-slate-500">
            <strong className="text-slate-700">Sobre el plazo:</strong> las {SEMANAS} semanas son de
            trabajo de integración. Los trámites que dependen de terceros —verificación de Meta,
            aprobación de plantillas y alta en la pasarela— se inician el primer día y se reportan por
            separado, porque no dependen de nosotros.
          </p>
        </Seccion>

        {/* 7 — Cómo arrancamos */}
        <Seccion n="7" titulo="Cómo arrancamos">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { n: '1', t: 'Confirmación', d: 'Nos dicen que sí y hacen el primer pago.' },
              { n: '2', t: 'Sus datos', d: 'Nos envían el Excel de su cartera actual.' },
              { n: '3', t: 'Primera entrega', d: 'En una semana ven el tablero con sus clientes reales.' },
            ].map((s) => (
              <div key={s.n} className="rounded-xl border border-slate-200 p-5">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                  {s.n}
                </div>
                <div className="mt-3 text-[14.5px] font-bold text-slate-800">{s.t}</div>
                <div className="mt-1 text-[13.5px] leading-relaxed text-slate-500">{s.d}</div>
              </div>
            ))}
          </div>
        </Seccion>

        <div className="border-t border-slate-200 pt-6 text-center text-[13px] text-slate-400">
          Cualquier duda, la resolvemos antes de arrancar. Preferimos decir las cosas claras desde el
          inicio.
        </div>
      </div>
    </div>
  )
}
