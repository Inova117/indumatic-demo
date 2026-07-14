import { useMemo, useRef, useState, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Dashboard from './components/Dashboard'
import Actividad from './components/Actividad'
import Segmentacion from './components/Segmentacion'
import Automatizaciones from './components/Automatizaciones'
import Reportes from './components/Reportes'
import ClientModal from './components/ClientModal'
import PaymentModal from './components/PaymentModal'
import Toaster from './components/Toaster'
import Onboarding from './components/Onboarding'
import {
  clientesIniciales,
  idsNoSePaganEnDemo,
  idsFallaWhatsApp,
  metricasBase,
  saludCanalInicial,
} from './mockData'
import { diasMora, esEnMora, elegirCanal, motivoCanal } from './utils'

export default function App() {
  const [active, setActive] = useState('cartera')
  const [invoices, setInvoices] = useState(clientesIniciales)
  const [toasts, setToasts] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [paymentId, setPaymentId] = useState(null)
  const [running, setRunning] = useState(false)
  const [flashSet, setFlashSet] = useState(() => new Set())
  const [recuperadoSesion, setRecuperadoSesion] = useState(0)
  const [recordatoriosSesion, setRecordatoriosSesion] = useState(0)
  const [diasPromedio, setDiasPromedio] = useState(metricasBase.diasPromedioCobroInicial)
  const [tourOpen, setTourOpen] = useState(true)
  const [salud, setSalud] = useState(saludCanalInicial)

  const toastId = useRef(0)
  const timers = useRef([])

  // ---- Datos derivados -----------------------------------------------------
  const clientes = useMemo(
    () =>
      invoices.map((c) => ({
        ...c,
        diasMora: diasMora(c.vence),
        canal: elegirCanal(c, salud.estado),
        motivoCanal: motivoCanal(c, salud.estado),
      })),
    [invoices, salud.estado],
  )

  const metrics = useMemo(() => {
    const enMora = invoices.filter((c) => esEnMora(c.estado))
    return {
      carteraVencida: enMora.reduce((s, c) => s + c.monto, 0),
      clientesEnMora: enMora.length,
      recuperadoMes: metricasBase.recuperadoMesBase + recuperadoSesion,
      diasPromedio,
      recordatoriosEnviados: metricasBase.recordatoriosEnviadosBase + recordatoriosSesion,
    }
  }, [invoices, recuperadoSesion, diasPromedio, recordatoriosSesion])

  const selected = useMemo(
    () => clientes.find((c) => c.id === selectedId) || null,
    [clientes, selectedId],
  )
  const paymentClient = useMemo(
    () => clientes.find((c) => c.id === paymentId) || null,
    [clientes, paymentId],
  )

  // ---- Toasts --------------------------------------------------------------
  const addToast = useCallback((toast) => {
    const id = ++toastId.current
    setToasts((prev) => [...prev, { ...toast, id }])
    const t = setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id))
    }, 2900)
    timers.current.push(t)
  }, [])

  const triggerFlash = useCallback((id) => {
    setFlashSet((prev) => new Set(prev).add(id))
    const t = setTimeout(() => {
      setFlashSet((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 1100)
    timers.current.push(t)
  }, [])

  const marcarPagado = useCallback(
    (inv) => {
      setInvoices((prev) =>
        prev.map((i) => (i.id === inv.id && i.estado !== 'Pagado' ? { ...i, estado: 'Pagado' } : i)),
      )
    },
    [],
  )

  // ---- Momento clave: ejecutar recordatorios (MOTOR MULTICANAL) -------------
  //  Por cada factura en mora el motor elige el canal, y si WhatsApp falla
  //  (código 132015 de Meta) reenvía por email automáticamente. Nunca se detiene.
  const ejecutarRecordatorios = useCallback(() => {
    if (running) return
    setRunning(true)

    const overdue = invoices.filter((c) => esEnMora(c.estado))
    if (overdue.length === 0) {
      setRunning(false)
      return
    }
    const held = new Set(idsNoSePaganEnDemo)
    const fallaWA = new Set(idsFallaWhatsApp)
    const stepSend = 260
    let lastT = 0

    overdue.forEach((inv, idx) => {
      const canal = elegirCanal(inv, salud.estado)
      // WhatsApp puede fallar → el motor detecta y cae a email solo.
      const falla = canal === 'whatsapp' && fallaWA.has(inv.id)
      const tSend = 300 + idx * stepSend

      timers.current.push(
        setTimeout(() => {
          setInvoices((prev) =>
            prev.map((i) => (i.id === inv.id && i.estado === 'Vencido' ? { ...i, estado: 'En gestión' } : i)),
          )
          setRecordatoriosSesion((n) => n + 1)
          triggerFlash(inv.id)
          if (falla) {
            // Fallo de WhatsApp + respaldo automático, en un solo aviso.
            addToast({ tipo: 'fallback', text: inv.cliente })
          } else {
            addToast({
              tipo: canal === 'whatsapp' ? 'whatsapp' : 'email',
              text: inv.cliente,
              motivo: canal === 'email' ? motivoCanal(inv, salud.estado) : null,
            })
          }
        }, tSend),
      )
      lastT = Math.max(lastT, tSend)

      if (!held.has(inv.id)) {
        const tPay = tSend + 980
        timers.current.push(
          setTimeout(() => {
            setInvoices((prev) => prev.map((i) => (i.id === inv.id ? { ...i, estado: 'Pagado' } : i)))
            setRecuperadoSesion((s) => s + inv.monto)
            triggerFlash(inv.id)
            addToast({ tipo: 'pago', text: inv.cliente, monto: inv.monto })
          }, tPay),
        )
        lastT = Math.max(lastT, tPay)
      }
    })

    timers.current.push(
      setTimeout(() => {
        setRunning(false)
        setDiasPromedio(metricasBase.diasPromedioCobroFinal)
      }, lastT + 600),
    )
  }, [running, invoices, salud.estado, addToast, triggerFlash])

  // ---- Salud del canal: el sistema se auto-protege --------------------------
  const simularBloqueos = useCallback(() => {
    setSalud({ estado: 'amarillo', entregados: saludCanalInicial.entregados, bloqueos: 24, bajas: 19 })
    addToast({ tipo: 'alerta', text: 'Calidad del número en riesgo — WhatsApp pausado' })
  }, [addToast])

  const restablecerSalud = useCallback(() => {
    setSalud(saludCanalInicial)
    addToast({ tipo: 'whatsapp', text: 'Calidad restablecida — WhatsApp reactivado' })
  }, [addToast])

  // ---- Reiniciar la demostración -------------------------------------------
  const reiniciarDemo = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setInvoices(clientesIniciales)
    setRecuperadoSesion(0)
    setRecordatoriosSesion(0)
    setDiasPromedio(metricasBase.diasPromedioCobroInicial)
    setSalud(saludCanalInicial)
    setFlashSet(new Set())
    setToasts([])
    setRunning(false)
    setSelectedId(null)
    setPaymentId(null)
  }, [])

  const onPaid = useCallback(
    (inv) => {
      const yaPagado = invoices.find((i) => i.id === inv.id)?.estado === 'Pagado'
      marcarPagado(inv)
      if (!yaPagado) {
        setRecuperadoSesion((s) => s + inv.monto)
        triggerFlash(inv.id)
        addToast({ tipo: 'pago', text: inv.cliente, monto: inv.monto })
      }
    },
    [invoices, marcarPagado, triggerFlash, addToast],
  )

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 text-slate-800">
      <Sidebar active={active} onChange={setActive} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar active={active} onStartTour={() => setTourOpen(true)} />

        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto max-w-[1400px] px-5 py-6 lg:px-8 lg:py-8">
            {active === 'cartera' && (
              <Dashboard
                clientes={clientes}
                metrics={metrics}
                onRun={ejecutarRecordatorios}
                running={running}
                onRowClick={(c) => setSelectedId(c.id)}
                flashSet={flashSet}
                salud={salud}
                onSimular={simularBloqueos}
                onRestablecer={restablecerSalud}
                onReiniciar={reiniciarDemo}
              />
            )}
            {active === 'actividad' && <Actividad />}
            {active === 'segmentacion' && <Segmentacion />}
            {active === 'automatizacion' && <Automatizaciones />}
            {active === 'reportes' && <Reportes metrics={metrics} />}

            <footer className="mt-8 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              Demostración · datos simulados · Indumatic · Cobranza
            </footer>
          </div>
        </main>
      </div>

      {/* Overlays */}
      <Toaster toasts={toasts.slice(-4)} />

      {selected && (
        <ClientModal
          cliente={selected}
          salud={salud.estado}
          onClose={() => setSelectedId(null)}
          onPagar={(c) => setPaymentId(c.id)}
        />
      )}

      {paymentClient && (
        <PaymentModal
          cliente={paymentClient}
          onClose={() => setPaymentId(null)}
          onPaid={onPaid}
        />
      )}

      {tourOpen && <Onboarding setSection={setActive} onClose={() => setTourOpen(false)} />}
    </div>
  )
}
