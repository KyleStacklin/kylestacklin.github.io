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
}

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
]

export const DEFAULT_RARITY_FILTERS: readonly string[] = RARITY_NAMES

export const filtersAreDefault = (filters: Set<string>): boolean =>
  filters.size === DEFAULT_RARITY_FILTERS.length &&
  DEFAULT_RARITY_FILTERS.every((rarity) => filters.has(rarity))

export const defaultFilters = (): Set<string> => new Set<string>(DEFAULT_RARITY_FILTERS)