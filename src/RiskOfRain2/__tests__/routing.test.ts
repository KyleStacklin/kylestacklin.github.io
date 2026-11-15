import { describe, expect, it } from 'vitest'
import { DISPLAY_TYPE_PATHS, pathToDisplayType, resolveInitialPath } from '../routing'

describe('pathToDisplayType', () => {
  it('maps display type paths to their display type', () => {
    expect(pathToDisplayType('/')).toBe('grid')
    expect(pathToDisplayType('/list')).toBe('list')
    expect(pathToDisplayType('/flashcards')).toBe('flashCards')
  })

  it('returns null for unknown paths', () => {
    expect(pathToDisplayType('/bogus')).toBeNull()
    expect(pathToDisplayType('')).toBeNull()
  })
})

describe('DISPLAY_TYPE_PATHS', () => {
  it('is consistent with pathToDisplayType', () => {
    ;(Object.keys(DISPLAY_TYPE_PATHS) as (keyof typeof DISPLAY_TYPE_PATHS)[]).forEach(
      (displayType) => {
        expect(pathToDisplayType(DISPLAY_TYPE_PATHS[displayType])).toBe(displayType)
      }
    )
  })
})

describe('resolveInitialPath', () => {
  it('uses the stored route when the hash is empty', () => {
    expect(resolveInitialPath('', '/list')).toBe('/list')
    expect(resolveInitialPath('#', '/flashcards')).toBe('/flashcards')
    expect(resolveInitialPath('   ', '/list')).toBe('/list')
  })

  it('prefers an explicit known hash over the stored route', () => {
    expect(resolveInitialPath('#/list', '/flashcards')).toBe('/list')
    expect(resolveInitialPath('#/flashcards', '/')).toBe('/flashcards')
    expect(resolveInitialPath('#/', '/list')).toBe('/')
  })

  it('falls back to "/" for an unknown hash', () => {
    expect(resolveInitialPath('#/bogus', '/list')).toBe('/')
    expect(resolveInitialPath('#nonsense', null)).toBe('/')
  })

  it('falls back to "/" when there is no stored route', () => {
    expect(resolveInitialPath('', null)).toBe('/')
    expect(resolveInitialPath('#', null)).toBe('/')
  })

  it('ignores stored routes that are not display type paths', () => {
    expect(resolveInitialPath('', '/bogus')).toBe('/')
    expect(resolveInitialPath('', 'bogus')).toBe('/')
  })
})
