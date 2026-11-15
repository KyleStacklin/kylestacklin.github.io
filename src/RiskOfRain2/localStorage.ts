import { DISPLAY_TYPES, DisplayType, DLC_CODES, RARITY_NAMES } from './RiskOfRain2Types'

const KEYS = {
  view: 'ror2.v1.view',
  filters: 'ror2.v1.filters',
  dlcs: 'ror2.v1.dlcs',
  headerExpanded: 'ror2.v1.headerExpanded',
  lastRoute: 'ror2.v1.lastRoute',
} as const

const readString = (key: string): string | null => {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(key)
  } catch (error) {
    return null
  }
}

const writeString = (key: string, value: string): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, value)
  } catch (error) {
    return
  }
}

export const loadStoredDisplayType = (): DisplayType | null => {
  const raw = readString(KEYS.view)
  if (!raw) return null
  return (DISPLAY_TYPES as readonly string[]).includes(raw) ? (raw as DisplayType) : null
}

export const saveDisplayType = (displayType: DisplayType): void => {
  writeString(KEYS.view, displayType)
}

export const loadStoredFilters = (): string[] | null => {
  const raw = readString(KEYS.filters)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed.filter(
      (entry) => typeof entry === 'string' && (RARITY_NAMES as readonly string[]).includes(entry)
    )
  } catch (error) {
    return null
  }
}

export const saveFilters = (filters: Set<string> | string[]): void => {
  const list = Array.isArray(filters) ? filters : Array.from(filters)
  writeString(KEYS.filters, JSON.stringify(list))
}

export const loadStoredDlcs = (): string[] | null => {
  const raw = readString(KEYS.dlcs)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed.filter(
      (entry) => typeof entry === 'string' && (DLC_CODES as readonly string[]).includes(entry)
    )
  } catch (error) {
    return null
  }
}

export const saveDlcs = (dlcs: Set<string> | string[]): void => {
  const list = Array.isArray(dlcs) ? dlcs : Array.from(dlcs)
  writeString(KEYS.dlcs, JSON.stringify(list))
}

export const loadStoredHeaderExpanded = (): boolean | null => {
  const raw = readString(KEYS.headerExpanded)
  if (raw === 'true') return true
  if (raw === 'false') return false
  return null
}

export const saveHeaderExpanded = (expanded: boolean): void => {
  writeString(KEYS.headerExpanded, String(expanded))
}

export const loadStoredRoute = (): string | null => {
  const raw = readString(KEYS.lastRoute)
  return raw && raw.startsWith('/') ? raw : null
}

export const saveLastRoute = (route: string): void => {
  writeString(KEYS.lastRoute, route)
}
