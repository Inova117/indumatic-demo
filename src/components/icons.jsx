// Conjunto de iconos SVG en línea — sin dependencias externas.
// Todos aceptan className para tamaño/color (usan currentColor).

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
}

export function IconWallet({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1" />
      <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H5" />
      <circle cx="16.5" cy="12.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconSegment({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <circle cx="7" cy="7" r="3" />
      <circle cx="17" cy="7" r="3" />
      <circle cx="7" cy="17" r="3" />
      <circle cx="17" cy="17" r="3" />
    </svg>
  )
}

export function IconReport({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M4 19V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14" />
      <path d="M4 19h16" />
      <path d="M8 16v-4" />
      <path d="M12 16V8" />
      <path d="M16 16v-6" />
    </svg>
  )
}

export function IconPlay({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.5v13a1 1 0 0 0 1.54.84l10-6.5a1 1 0 0 0 0-1.68l-10-6.5A1 1 0 0 0 8 5.5Z" />
    </svg>
  )
}

export function IconCheck({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} {...base}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

export function IconCheckDouble({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12.5l4 4L14.5 8" />
      <path d="M9 16.5l1 1L22 6" />
    </svg>
  )
}

export function IconClock({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function IconBuilding({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} {...base}>
      <path d="M4 21V6a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v15" />
      <path d="M15 10h4a1 1 0 0 1 1 1v10" />
      <path d="M4 21h17" />
      <path d="M7.5 9h3M7.5 13h3M7.5 17h3" />
    </svg>
  )
}

export function IconUser({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  )
}

export function IconX({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function IconWhatsApp({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.004c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.17 0 4.2.84 5.74 2.38a8.06 8.06 0 0 1 2.37 5.73c0 4.48-3.64 8.11-8.12 8.11a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.19-.31a8.03 8.03 0 0 1-1.24-4.29c0-4.48 3.65-8.12 8.13-8.12Zm-2.6 4.35c-.14 0-.37.05-.56.26-.19.21-.73.72-.73 1.75s.75 2.03.86 2.17c.1.14 1.45 2.32 3.58 3.16 1.77.7 2.13.56 2.51.52.38-.03 1.24-.5 1.42-.99.18-.49.18-.9.12-.99-.05-.09-.19-.14-.4-.24-.21-.11-1.24-.61-1.43-.68-.19-.07-.33-.1-.47.1-.14.21-.54.68-.66.82-.12.14-.24.16-.45.05-.21-.1-.88-.32-1.68-1.03-.62-.55-1.04-1.24-1.16-1.45-.12-.21-.01-.32.09-.42.09-.09.21-.24.31-.36.1-.12.14-.21.21-.35.07-.14.03-.26-.02-.36-.05-.1-.46-1.13-.64-1.55-.17-.41-.34-.35-.47-.36l-.4-.01Z" />
    </svg>
  )
}

export function IconCard({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 9.5h19" />
      <path d="M6 15h4" />
    </svg>
  )
}

export function IconShield({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3l7 3v5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3Z" />
      <path d="M9.5 12l1.8 1.8L15 10" />
    </svg>
  )
}

export function IconArrowDown({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} {...base}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  )
}

export function IconArrowUp({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} {...base}>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  )
}

export function IconUsers({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.3A3 3 0 0 1 16 11" />
      <path d="M17 14.2a5.5 5.5 0 0 1 3.5 4.8" />
    </svg>
  )
}

export function IconSearch({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} {...base}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  )
}

export function IconBell({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
      <path d="M10.5 19a1.5 1.5 0 0 0 3 0" />
    </svg>
  )
}

export function IconSend({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a1 1 0 0 0-1.39 1.03l1.2 6.86a1 1 0 0 0 .82.82l8.7 1.28-8.7 1.28a1 1 0 0 0-.82.82l-1.2 6.86a1 1 0 0 0 1.39 1.05Z" />
    </svg>
  )
}

export function IconLightning({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13l0-8Z" />
    </svg>
  )
}

export function IconPlus({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} {...base}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconTrendDown({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} {...base}>
      <path d="M3 7l6 6 4-4 8 8" />
      <path d="M21 17v-6h-6" />
    </svg>
  )
}

export function IconWorkflow({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="4" width="6" height="5" rx="1.2" />
      <rect x="15" y="15" width="6" height="5" rx="1.2" />
      <rect x="15" y="4" width="6" height="5" rx="1.2" />
      <path d="M9 6.5h6M9 6.5v11h6" />
    </svg>
  )
}

export function IconDatabase({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
      <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </svg>
  )
}

export function IconWebhook({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M9 8a3 3 0 1 1 4 2.8l2.4 4.2" />
      <path d="M15 16a3 3 0 1 1-3-3" />
      <path d="M8.6 11.2 6.2 15.4A3 3 0 1 0 9 20h6" />
    </svg>
  )
}

export function IconBranch({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="6" cy="18" r="2.4" />
      <circle cx="18" cy="12" r="2.4" />
      <path d="M6 8.4v7.2" />
      <path d="M8.2 6h4.4a3 3 0 0 1 3 3v.6M8.2 18h4.4a3 3 0 0 0 3-3v-.6" />
    </svg>
  )
}

export function IconFx({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 20c0-3 .8-8 1.6-11C8.2 6.6 9 5 10.6 5c.9 0 1.4.5 1.4 1.1 0 .7-.6 1.1-1.2 1.1M5 12h6" />
      <path d="M14 10l5 6M19 10l-5 6" />
    </svg>
  )
}

export function IconMail({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 5 8-5" />
    </svg>
  )
}

export function IconBolt({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13l0-8Z" />
    </svg>
  )
}

export function IconPlug({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M9 3v5M15 3v5" />
      <path d="M7 8h10v3a5 5 0 0 1-10 0V8Z" />
      <path d="M12 16v5" />
    </svg>
  )
}

export function IconMinus({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} {...base}>
      <path d="M5 12h14" />
    </svg>
  )
}

export function IconMaximize({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} {...base}>
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  )
}

export function IconActivity({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M3 12h4l2.5-7 4 14L16 12h5" />
    </svg>
  )
}

export function IconPause({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  )
}

export function IconHelp({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.3 9.2a2.8 2.8 0 0 1 5.4 1c0 1.9-2.7 2.3-2.7 3.9" />
      <circle cx="12" cy="17.2" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconChevronRight({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} {...base}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

export function IconChevronLeft({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} {...base}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  )
}

export function IconPhone({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} {...base}>
      <path d="M4 5c0 8.3 6.7 15 15 15a1.6 1.6 0 0 0 1.6-1.6v-2.3a1.2 1.2 0 0 0-1-1.2l-3-.5a1.2 1.2 0 0 0-1.1.4l-1 1.1a11.5 11.5 0 0 1-5-5l1.1-1a1.2 1.2 0 0 0 .4-1.1l-.5-3a1.2 1.2 0 0 0-1.2-1H5.6A1.6 1.6 0 0 0 4 5Z" />
    </svg>
  )
}
