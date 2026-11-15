export type RiskOfRain2Item = {
  name: string;
  tags?: string[];
  rarity: string;
  unlock: string;
  effect: string;
  stack: string;
  image: string;
  maxstack?: number;
  cooldown?: number;
  dlc?: DlcCode;
}

export type DlcCode = 'base' | 'sotv' | 'sots' | 'alloyed' | 'hallowed'

export const DLC_CODES: readonly DlcCode[] = ['base', 'sotv', 'sots', 'alloyed', 'hallowed']

export const DLC_NAMES: Record<DlcCode, string> = {
  base: 'Base Game',
  sotv: 'Survivors of the Void',
  sots: 'Seekers of the Storm',
  alloyed: 'Alloyed Collective',
  hallowed: 'Hallowed Concepts',
}

export const DEFAULT_DLC_FILTERS: readonly DlcCode[] = DLC_CODES

export const dlcsAreDefault = (dlcs: Set<string>): boolean =>
  dlcs.size === DEFAULT_DLC_FILTERS.length &&
  DEFAULT_DLC_FILTERS.every((code) => dlcs.has(code))

export const defaultDlcs = (): Set<string> => new Set<string>(DLC_CODES)

export type DisplayType = 'grid' | 'list' | 'flashCards'

export const DISPLAY_TYPES: readonly DisplayType[] = ['grid', 'list', 'flashCards']

export const RARITY_NAMES: readonly string[] = [
  'Common',
  'Uncommon',
  'Legendary',
  'Boss',
  'Void',
  'Lunar',
  'Equipment',
  'Hex',
  'Hallowed',
  'Page',
]

export const DEFAULT_RARITY_FILTERS: readonly string[] = RARITY_NAMES

export const filtersAreDefault = (filters: Set<string>): boolean =>
  filters.size === DEFAULT_RARITY_FILTERS.length &&
  DEFAULT_RARITY_FILTERS.every((rarity) => filters.has(rarity))

export const defaultFilters = (): Set<string> => new Set<string>(DEFAULT_RARITY_FILTERS)