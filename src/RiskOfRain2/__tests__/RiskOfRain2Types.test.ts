import { describe, expect, it } from 'vitest'
import {
  DEFAULT_DLC_FILTERS,
  DLC_CODES,
  DLC_NAMES,
  DISPLAY_TYPES,
  RARITY_NAMES,
  defaultFilters,
  filtersAreDefault,
} from '../RiskOfRain2Types'

describe('defaultFilters', () => {
  it('contains every rarity name', () => {
    expect(defaultFilters().size).toBe(RARITY_NAMES.length)
    RARITY_NAMES.forEach((rarity) => {
      expect(defaultFilters().has(rarity)).toBe(true)
    })
  })

  it('returns a fresh set each call', () => {
    const first = defaultFilters()
    first.delete('Common')
    expect(defaultFilters().has('Common')).toBe(true)
  })
})

describe('filtersAreDefault', () => {
  it('is true for the default filter set', () => {
    expect(filtersAreDefault(defaultFilters())).toBe(true)
  })

  it('is false when a rarity has been removed', () => {
    const filters = defaultFilters()
    filters.delete('Legendary')
    expect(filtersAreDefault(filters)).toBe(false)
  })

  it('is false for an empty set', () => {
    expect(filtersAreDefault(new Set<string>())).toBe(false)
  })

  it('is false for a set with extra entries', () => {
    expect(filtersAreDefault(new Set([...RARITY_NAMES, 'Extra']))).toBe(false)
  })

  it('is false for a partially filled set', () => {
    expect(filtersAreDefault(new Set(['Common', 'Uncommon']))).toBe(false)
  })
})

describe('view type constants', () => {
  it('exposes the three display types in order', () => {
    expect([...DISPLAY_TYPES]).toEqual(['grid', 'list', 'flashCards'])
  })

  it('exposes the ten rarities in order', () => {
    expect([...RARITY_NAMES]).toEqual([
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
    ])
  })
})

describe('DLC constants', () => {
  it('lists every DLC in order, ending with Hallowed Concepts', () => {
    expect([...DLC_CODES]).toEqual(['base', 'sotv', 'sots', 'alloyed', 'hallowed'])
    expect([...DEFAULT_DLC_FILTERS]).toEqual([...DLC_CODES])
  })

  it('names every DLC, including Hallowed Concepts', () => {
    expect(DLC_NAMES.hallowed).toBe('Hallowed Concepts')
    DLC_CODES.forEach((code) => {
      expect(DLC_NAMES[code]).toBeTruthy()
    })
  })
})
