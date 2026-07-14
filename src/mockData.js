// ============================================================================
//  DATOS DE DEMOSTRACIÓN — Indumatic · Cobranza
//  Todo es simulado. No hay backend ni integraciones reales.
//  Edite libremente los valores de este archivo para adaptar la demo.
// ============================================================================

// Fecha "de hoy" fija para que la demo sea siempre consistente.
export const HOY = '2026-07-09'

// ----------------------------------------------------------------------------
//  Cadencias por segmento (usadas en Segmentación y en el chat de WhatsApp)
// ----------------------------------------------------------------------------
export const cadencias = {
  Empresa: {
    nombre: 'Clientes Empresa',
    descripcion: 'Compañías formales, facturas de mayor monto y plazos amplios.',
    tono: 'Formal',
    tonoDetalle: 'Comunicación corporativa, trato de usted, foco en regularización.',
    frecuencia: '3 recordatorios + escalamiento',
    // Días relativos al vencimiento: negativo = antes de vencer
    dias: [-5, 0, 10, 20],
    pasos: [
      { etiqueta: 'Pre-vencimiento', dia: -5, tipo: 'amable' },
      { etiqueta: 'Día de vencimiento', dia: 0, tipo: 'recordatorio' },
      { etiqueta: 'Seguimiento', dia: 10, tipo: 'firme' },
      // El escalamiento NO es un mensaje: es una tarea para una persona.
      { etiqueta: 'Escalamiento a analista', dia: 20, tipo: 'tarea' },
    ],
  },
  Informal: {
    nombre: 'Clientes Informales',
    descripcion: 'Talleres, comercios y personas. Montos menores, mayor mora.',
    tono: 'Cercano',
    tonoDetalle: 'Trato cercano y amable, mensajes más frecuentes y directos.',
    frecuencia: '3 recordatorios + escalamiento',
    dias: [-3, 0, 5, 12],
    pasos: [
      { etiqueta: 'Pre-vencimiento', dia: -3, tipo: 'amable' },
      { etiqueta: 'Día de vencimiento', dia: 0, tipo: 'recordatorio' },
      { etiqueta: 'Recordatorio cercano', dia: 5, tipo: 'firme' },
      { etiqueta: 'Escalamiento a analista', dia: 12, tipo: 'tarea' },
    ],
  },
}

// ----------------------------------------------------------------------------
//  Canales de contacto — el motor es multicanal. WhatsApp es UN canal, no el producto.
// ----------------------------------------------------------------------------
export const canales = {
  whatsapp: {
    nombre: 'WhatsApp',
    detalle: 'Mejor conversión. Requiere autorización del cliente y salud del número en verde.',
    requiereOptIn: true,
  },
  email: {
    nombre: 'Email',
    detalle: 'Siempre disponible. Sin dependencia de plataformas externas.',
    requiereOptIn: false,
  },
  sms: {
    nombre: 'SMS',
    detalle: 'Respaldo cuando no hay email válido.',
    requiereOptIn: false,
  },
}

// Salud del número de WhatsApp (quality rating). El sistema la vigila y se auto-protege.
export const saludCanalInicial = {
  estado: 'verde', // verde | amarillo | rojo
  entregados: 1284,
  bloqueos: 3,
  bajas: 7,
}

// ----------------------------------------------------------------------------
//  Cartera — clientes / facturas
// ----------------------------------------------------------------------------
//  estado inicial: 'Al día' | 'Por vencer' | 'Vencido' | 'En gestión' | 'Pagado'
//  (diasMora se calcula automáticamente a partir de `vence` y HOY)
// ----------------------------------------------------------------------------
export const clientesIniciales = [
  // ---- Clientes Empresa -----------------------------------------------------
  {
    id: 1,
    cliente: 'Alimentos del Valle S.A.',
    nombreCorto: 'Alimentos del Valle',
    tipo: 'Empresa',
    industria: 'Industria alimenticia',
    telefono: '+593 98 452 1130',
    email: 'cobros@alimentosdelvalle.ec',
    optIn: true,
    factura: 'F-2026-0512',
    monto: 6800.0,
    vence: '2026-07-19',
    plazoDias: 35,
    estado: 'Al día',
  },
  {
    id: 2,
    cliente: 'Lácteos Andinos Cía. Ltda.',
    nombreCorto: 'Lácteos Andinos',
    tipo: 'Empresa',
    industria: 'Industria alimenticia',
    telefono: '+593 99 210 8845',
    email: 'pagos@lacteosandinos.ec',
    optIn: true,
    factura: 'F-2026-0498',
    monto: 4250.0,
    vence: '2026-07-04',
    plazoDias: 35,
    estado: 'Vencido',
  },
  {
    id: 3,
    cliente: 'Constructora Herrera S.A.',
    nombreCorto: 'Constructora Herrera',
    tipo: 'Empresa',
    industria: 'Construcción',
    telefono: '+593 98 771 3320',
    email: 'contabilidad@constructoraherrera.ec',
    optIn: true,
    factura: 'F-2026-0505',
    monto: 7800.0,
    vence: '2026-07-12',
    plazoDias: 60,
    estado: 'Por vencer',
  },
  {
    id: 4,
    cliente: 'Metalúrgica Sur C.A.',
    nombreCorto: 'Metalúrgica Sur',
    tipo: 'Empresa',
    industria: 'Metalmecánica',
    telefono: '+593 99 634 2201',
    email: 'tesoreria@metalurgicasur.ec',
    optIn: true,
    factura: 'F-2026-0471',
    monto: 5400.0,
    vence: '2026-06-19',
    plazoDias: 60,
    estado: 'Vencido',
  },
  {
    id: 5,
    cliente: 'Textiles Ecuador S.A.',
    nombreCorto: 'Textiles Ecuador',
    tipo: 'Empresa',
    industria: 'Textil',
    telefono: '+593 98 009 4417',
    email: 'pagos@textilesecuador.ec',
    optIn: false,
    factura: 'F-2026-0460',
    monto: 3900.0,
    vence: '2026-05-25',
    plazoDias: 90,
    estado: 'Vencido',
  },
  {
    id: 6,
    cliente: 'Agroindustria Manabí S.A.',
    nombreCorto: 'Agroindustria Manabí',
    tipo: 'Empresa',
    industria: 'Agroindustria',
    telefono: '+593 99 815 6672',
    email: 'finanzas@agromanabi.ec',
    optIn: true,
    factura: 'F-2026-0521',
    monto: 8000.0,
    vence: '2026-07-28',
    plazoDias: 60,
    estado: 'Al día',
  },
  {
    id: 7,
    cliente: 'Plásticos del Litoral Cía.',
    nombreCorto: 'Plásticos del Litoral',
    tipo: 'Empresa',
    industria: 'Plásticos',
    telefono: '+593 98 553 7789',
    email: 'contabilidad@plasticoslitoral.ec',
    optIn: true,
    factura: 'F-2026-0489',
    monto: 2100.0,
    vence: '2026-07-07',
    plazoDias: 45,
    estado: 'Vencido',
  },
  {
    id: 8,
    cliente: 'Envasados Guayas S.A.',
    nombreCorto: 'Envasados Guayas',
    tipo: 'Empresa',
    industria: 'Envases',
    telefono: '+593 99 402 1198',
    email: 'pagos@envasadosguayas.ec',
    optIn: true,
    factura: 'F-2026-0450',
    monto: 5900.0,
    vence: '2026-06-30',
    plazoDias: 60,
    estado: 'En gestión',
  },

  // ---- Clientes Informales --------------------------------------------------
  {
    id: 9,
    cliente: 'Taller Mecánico El Rayo',
    nombreCorto: 'Taller El Rayo',
    tipo: 'Informal',
    industria: 'Taller mecánico',
    telefono: '+593 96 338 5540',
    email: 'tallerelrayo@gmail.com',
    optIn: false,
    factura: 'F-2026-0388',
    monto: 780.0,
    vence: '2026-04-10',
    plazoDias: 30,
    estado: 'Vencido',
  },
  {
    id: 10,
    cliente: 'José Cabrera — Ferretería',
    nombreCorto: 'Don José',
    tipo: 'Informal',
    industria: 'Ferretería',
    telefono: '+593 97 112 9083',
    email: 'jcabrera.ferreteria@gmail.com',
    optIn: true,
    factura: 'F-2026-0402',
    monto: 1250.0,
    vence: '2026-05-05',
    plazoDias: 30,
    estado: 'Vencido',
  },
  {
    id: 11,
    cliente: 'Distribuidora La Económica',
    nombreCorto: 'La Económica',
    tipo: 'Informal',
    industria: 'Distribución',
    telefono: '+593 98 664 2215',
    email: 'laeconomica.dist@gmail.com',
    optIn: false,
    factura: 'F-2026-0510',
    monto: 560.0,
    vence: '2026-07-15',
    plazoDias: 30,
    estado: 'Por vencer',
  },
  {
    id: 12,
    cliente: 'Carpintería Los Cedros',
    nombreCorto: 'Carpintería Los Cedros',
    tipo: 'Informal',
    industria: 'Carpintería',
    telefono: '+593 96 890 4471',
    email: 'loscedros.carpinteria@gmail.com',
    optIn: true,
    factura: 'F-2026-0415',
    monto: 1680.0,
    vence: '2026-05-20',
    plazoDias: 30,
    estado: 'Vencido',
  },
  {
    id: 13,
    cliente: 'Comercial Nataly',
    nombreCorto: 'Nataly',
    tipo: 'Informal',
    industria: 'Comercio',
    telefono: '+593 99 337 1206',
    email: 'comercialnataly@hotmail.com',
    optIn: false,
    factura: 'F-2026-0495',
    monto: 420.0,
    vence: '2026-07-01',
    plazoDias: 15,
    estado: 'Vencido',
  },
  {
    id: 14,
    cliente: 'Servicios Industriales Vera',
    nombreCorto: 'Sr. Vera',
    tipo: 'Informal',
    industria: 'Servicios industriales',
    telefono: '+593 98 220 7754',
    email: 'serviciosvera@gmail.com',
    optIn: true,
    factura: 'F-2026-0430',
    monto: 1950.0,
    vence: '2026-06-04',
    plazoDias: 30,
    estado: 'Vencido',
  },
  {
    id: 15,
    cliente: 'Refrigeración Costa',
    nombreCorto: 'Refrigeración Costa',
    tipo: 'Informal',
    industria: 'Refrigeración',
    telefono: '+593 97 545 3391',
    email: 'refrigeracioncosta@gmail.com',
    optIn: false,
    factura: 'F-2026-0475',
    monto: 1320.0,
    vence: '2026-06-24',
    plazoDias: 30,
    estado: 'Vencido',
  },
  {
    id: 16,
    cliente: 'Panadería La Espiga',
    nombreCorto: 'La Espiga',
    tipo: 'Informal',
    industria: 'Panadería',
    telefono: '+593 96 771 8890',
    email: 'panaderialaespiga@gmail.com',
    optIn: true,
    factura: 'F-2026-0466',
    monto: 890.0,
    vence: '2026-06-15',
    plazoDias: 30,
    estado: 'Pagado',
  },
]

// ----------------------------------------------------------------------------
//  Facturas que NO se cobran automáticamente al ejecutar (para dar realismo:
//  las grandes pasan a "En gestión" pero no se pagan en el acto).
// ----------------------------------------------------------------------------
export const idsNoSePaganEnDemo = [4, 5, 10] // Metalúrgica, Textiles, Don José

// Facturas cuyo WhatsApp "falla" (código 132015 de Meta) para demostrar el
// respaldo automático: el sistema lo detecta y reenvía por email, solo.
export const idsFallaWhatsApp = [2, 12] // Lácteos Andinos, Carpintería Los Cedros

// ----------------------------------------------------------------------------
//  Métricas base (lo ya recuperado este mes antes de esta ejecución, etc.)
// ----------------------------------------------------------------------------
export const metricasBase = {
  recuperadoMesBase: 18400.0,
  recordatoriosEnviadosBase: 128,
  diasPromedioCobroInicial: 42,
  diasPromedioCobroFinal: 38,
  tasaRecuperacion: 87, // %
  reduccionMora: 34, // % vs mes anterior
}

// ----------------------------------------------------------------------------
//  Serie histórica de cartera vencida (para el gráfico de tendencia).
//  El último punto ("Hoy") se enlaza en vivo con la cartera vencida actual.
// ----------------------------------------------------------------------------
export const historicoCartera = [
  { semana: 'Sem 1', valor: 48200 },
  { semana: 'Sem 2', valor: 44100 },
  { semana: 'Sem 3', valor: 41800 },
  { semana: 'Sem 4', valor: 38600 },
  { semana: 'Sem 5', valor: 35200 },
  { semana: 'Sem 6', valor: 33100 },
  { semana: 'Sem 7', valor: 30900 },
  // 'Hoy' se agrega dinámicamente en el componente.
]

// ----------------------------------------------------------------------------
//  Recuperado por mes (Reportes) — tendencia ascendente.
// ----------------------------------------------------------------------------
export const recuperadoPorMes = [
  { mes: 'Feb', valor: 21400 },
  { mes: 'Mar', valor: 24800 },
  { mes: 'Abr', valor: 23900 },
  { mes: 'May', valor: 28600 },
  { mes: 'Jun', valor: 31200 },
  { mes: 'Jul', valor: 36800 },
]

// Recuperación por segmento (Reportes)
export const recuperacionPorSegmento = [
  { segmento: 'Empresa', valor: 24600, pct: 67 },
  { segmento: 'Informal', valor: 12200, pct: 33 },
]
