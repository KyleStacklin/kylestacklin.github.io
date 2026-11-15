import { beforeEach, describe, expect, it } from 'vitest'
import {
  loadStoredDisplayType,
  loadStoredFilters,
  loadStoredHeaderExpanded,
  loadStoredRoute,
  saveDisplayType,
  saveFilters,
  saveHeaderExpanded,
  saveLastRoute,
} from '../localStorage'

describe('localStorage helpers', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('round-trips the display type', () => {
    expect(loadStoredDisplayType()).toBeNull()
    saveDisplayType('flashCards')
    expect(loadStoredDisplayType()).toBe('flashCards')
    saveDisplayType('list')
    expect(loadStoredDisplayType()).toBe('list')
  })

  it('rejects invalid stored display types', () => {
    window.localStorage.setItem('ror2.v1.view', 'bogus')
    expect(loadStoredDisplayType()).toBeNull()
    window.localStorage.setItem('ror2.v1.view', '')
    expect(loadStoredDisplayType()).toBeNull()
  })

  it('round-trips filters from a Set and from an array', () => {
    saveFilters(new Set(['Common', 'Void']))
    expect(loadStoredFilters()).toEqual(['Common', 'Void'])
    saveFilters(['Legendary'])
    expect(loadStoredFilters()).toEqual(['Legendary'])
  })

  it('falls back to null on corrupt filter JSON', () => {
    window.localStorage.setItem('ror2.v1.filters', '{not json')
    expect(loadStoredFilters()).toBeNull()
    window.localStorage.setItem('ror2.v1.filters', '')
    expect(loadStoredFilters()).toBeNull()
  })

  it('drops non-rarity and non-string filter entries', () => {
    window.localStorage.setItem(
      'ror2.v1.filters',
      JSON.stringify(['Bogus', 3, null, 'Boss'])
    )
    expect(loadStoredFilters()).toEqual(['Boss'])
  })

  it('falls back to null when stored filters are not an array', () => {
    window.localStorage.setItem('ror2.v1.filters', JSON.stringify({ filters: ['Common'] }))
    expect(loadStoredFilters()).toBeNull()
    window.localStorage.setItem('ror2.v1.filters', JSON.stringify('Common'))
    expect(loadStoredFilters()).toBeNull()
  })

  it('round-trips header expanded state', () => {
    expect(loadStoredHeaderExpanded()).toBeNull()
    saveHeaderExpanded(false)
    expect(loadStoredHeaderExpanded()).toBe(false)
    saveHeaderExpanded(true)
    expect(loadStoredHeaderExpanded()).toBe(true)
  })

  it('falls back to null for junk header expanded values', () => {
    window.localStorage.setItem('ror2.v1.headerExpanded', 'banana')
    expect(loadStoredHeaderExpanded()).toBeNull()
    window.localStorage.setItem('ror2.v1.headerExpanded', '1')
    expect(loadStoredHeaderExpanded()).toBeNull()
  })

  it('round-trips the last route', () => {
    expect(loadStoredRoute()).toBeNull()
    saveLastRoute('/flashcards')
    expect(loadStoredRoute()).toBe('/flashcards')
    saveLastRoute('/list')
    expect(loadStoredRoute()).toBe('/list')
  })

  it('rejects stored routes that are not paths', () => {
    window.localStorage.setItem('ror2.v1.lastRoute', 'flashcards')
    expect(loadStoredRoute()).toBeNull()
    window.localStorage.setItem('ror2.v1.lastRoute', '')
    expect(loadStoredRoute()).toBeNull()
  })
})
