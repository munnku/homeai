// Thin-line outline icons — strokeWidth 1.5, fill="none" throughout
// All icons default to var(--icon); override with color prop for active/semantic states.

import type { JSX } from 'react'

type P = { size?: number; color?: string }

const c = (color?: string) => color ?? 'var(--icon)'
const base = (color?: string) => ({
  fill: 'none' as const,
  stroke: c(color),
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

// ─── Navigation & UI ─────────────────────────────

export function IconHome({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <path d="M2.25 12 10.204 4.046a2.538 2.538 0 0 1 3.592 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75V15.75c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
    </svg>
  )
}

export function IconSearch({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <path d="M21 21 15.803 15.803m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  )
}

export function IconBox({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <path d="M21 7.5l-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  )
}

export function IconSettings({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.076.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7 7 0 0 1 0 .255c-.008.378.137.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
      <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  )
}

export function IconPlus({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <path d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

export function IconChevronRight({ size = 16, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  )
}

export function IconChevronDown({ size = 16, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <path d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

export function IconArrowLeft({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  )
}

export function IconCamera({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <path d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
  )
}

export function IconQR({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="5.5" y="5.5" width="2" height="2" rx="0.4" />
      <rect x="16.5" y="5.5" width="2" height="2" rx="0.4" />
      <rect x="5.5" y="16.5" width="2" height="2" rx="0.4" />
      <path d="M14 14h3v3h-3ZM17 17h3v3h-3ZM14 20h3M20 14v3" />
    </svg>
  )
}

export function IconEdit({ size = 18, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
    </svg>
  )
}

export function IconTrash({ size = 18, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  )
}

export function IconMove({ size = 18, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <path d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  )
}

export function IconGrid({ size = 20, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <path d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  )
}

export function IconList({ size = 20, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <path d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  )
}

export function IconSend({ size = 18, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <path d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
  )
}

// ─── Room icons ───────────────────────────────────

export function IconLivingRoom({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <path d="M4 11V8a1 1 0 011-1h14a1 1 0 011 1v3" />
      <path d="M2 11a2 2 0 012 2v3h16v-3a2 2 0 012-2" />
      <path d="M7 16v2.5M17 16v2.5" />
    </svg>
  )
}

export function IconKitchen({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <rect x="2" y="4" width="20" height="17" rx="1.5" />
      <circle cx="8.5" cy="10.5" r="2" />
      <circle cx="15.5" cy="10.5" r="2" />
      <path d="M6 17h12" />
    </svg>
  )
}

export function IconBedroom({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <path d="M2 19v-6l.5-1A2 2 0 014.3 11h15.4a2 2 0 011.8 1l.5 1v6" />
      <path d="M2 15.5h20" />
      <path d="M7 11V8.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5V11" />
    </svg>
  )
}

export function IconBathroom({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <path d="M4 12h16M4 12a2 2 0 00-2 2v2.5a2 2 0 002 2h16a2 2 0 002-2V14a2 2 0 00-2-2M6 12V7a2 2 0 014 0" />
      <circle cx="17" cy="4" r="1" />
      <path d="M15.5 5.5l3-3" />
    </svg>
  )
}

export function IconKidsRoom({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <path d="M12 2l2.09 6.41H21l-5.45 3.96 2.09 6.42L12 14.84l-5.64 4.05 2.09-6.42L3 8.41h6.91L12 2z" />
    </svg>
  )
}

export function IconStorage({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <rect x="3" y="2" width="18" height="20" rx="1" />
      <path d="M3 8h18M3 14h18" />
      <path d="M9 8v6M15 8v6" />
    </svg>
  )
}

// ─── AI / special ─────────────────────────────────

export function IconSparkle({ size = 22, color }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base(color)}>
      <path d="M12 3l1.8 5.4L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.6L12 3z" />
      <path d="M19 14l.9 2.7 2.7.9-2.7.9L19 21l-.9-2.7-2.7-.9 2.7-.9L19 14z" />
      <path d="M5 17l.6 1.7 1.7.6-1.7.6L5 21.6l-.6-1.7-1.7-.6 1.7-.6L5 17z" />
    </svg>
  )
}

// ─── Icon lookup ──────────────────────────────────

export type RoomIconKey = 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'child' | 'storage'

const ROOM_ICON_MAP: Record<string, (props: P) => JSX.Element> = {
  living:   IconLivingRoom,
  kitchen:  IconKitchen,
  bedroom:  IconBedroom,
  bathroom: IconBathroom,
  child:    IconKidsRoom,
  storage:  IconStorage,
}

export function getRoomIcon(key: string): (props: P) => JSX.Element {
  return ROOM_ICON_MAP[key] ?? IconStorage
}
