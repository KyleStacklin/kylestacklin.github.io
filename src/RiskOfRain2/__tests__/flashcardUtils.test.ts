import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  accuracyPercent,
  buildQuestions,
  loadMode,
  loadOptionCount,
  loadStats,
  saveMode,
  saveOptionCount,
  saveStats,
  shuffle,
  type FlashcardItem,
  type FlashcardMode,
} from '../RiskOfRainFlashCards/flashcardUtils'

const makeItem = (nickname: string): FlashcardItem => ({
  displayName: nickname,
  nickname,
  rarity: 0,
  description: `description of ${nickname}`,
  itemNumber: 1,
  unlockTask: null,
})

describe('shuffle', () => {
  it('keeps deck size and elements', () => {
    const deck = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
    const shuffled = shuffle(deck)
    expect(shuffled).toHaveLength(deck.length)
    expect(new Set(shuffled)).toEqual(new Set(deck))
    expect([...shuffled].sort()).toEqual([...deck].sort())
  })

  it('does not mutate the input deck', () => {
    const deck = [1, 2, 3, 4]
    shuffle(deck)
    expect(deck).toEqual([1, 2, 3, 4])
  })

  it('actually reorders deterministically under a stubbed Math.random', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0)
    try {
      expect(shuffle([1, 2, 3, 4])).toEqual([2, 3, 4, 1])
    } finally {
      randomSpy.mockRestore()
    }
  })
})

describe('buildQuestions', () => {
  const pool = ['a', 'b', 'c', 'd', 'e', 'f'].map(makeItem)

  it('respects the requested session length', () => {
    expect(buildQuestions(pool, 3, 4)).toHaveLength(3)
    expect(buildQuestions(pool, 1, 4)).toHaveLength(1)
    expect(buildQuestions(pool, 0, 4)).toHaveLength(0)
  })

  it('caps the session at the pool size', () => {
    expect(buildQuestions(pool, 10, 4)).toHaveLength(6)
    expect(buildQuestions(pool.slice(0, 2), 10, 4)).toHaveLength(2)
  })

  it('never repeats a question item within a session', () => {
    const questions = buildQuestions(pool, 6, 4)
    const items = questions.map((question) => question.item.nickname)
    expect(new Set(items).size).toBe(items.length)
  })

  it('gives each question optionsPerQuestion distinct options including the answer', () => {
    const questions = buildQuestions(pool, 5, 4)
    expect(questions).toHaveLength(5)
    questions.forEach((question) => {
      expect(question.options).toHaveLength(4)
      const nicknames = question.options.map((option) => option.nickname)
      expect(new Set(nicknames).size).toBe(4)
      expect(nicknames).toContain(question.item.nickname)
    })
  })

  it('caps options at the pool size', () => {
    const smallPool = pool.slice(0, 2)
    buildQuestions(smallPool, 2, 6).forEach((question) => {
      expect(question.options).toHaveLength(2)
      expect(new Set(question.options.map((option) => option.nickname)).size).toBe(2)
    })
  })
})

describe('accuracyPercent', () => {
  it('rounds correct/total to a whole percentage', () => {
    expect(accuracyPercent(7, 10)).toBe(70)
    expect(accuracyPercent(3, 3)).toBe(100)
    expect(accuracyPercent(1, 3)).toBe(33)
    expect(accuracyPercent(2, 3)).toBe(67)
  })

  it('is 0 for an empty session', () => {
    expect(accuracyPercent(0, 0)).toBe(0)
  })
})

describe('stats and option count storage', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  it('defaults stats to zeros when nothing is stored', () => {
    expect(loadStats()).toEqual({ bestStreak: 0, bestAccuracy: 0 })
  })

  it('round-trips stats and falls back safely on corrupt JSON', () => {
    saveStats({ bestStreak: 5, bestAccuracy: 80 })
    expect(loadStats()).toEqual({ bestStreak: 5, bestAccuracy: 80 })
    window.localStorage.setItem('ror2-flashcards-stats', '{not json')
    expect(loadStats()).toEqual({ bestStreak: 0, bestAccuracy: 0 })
    window.localStorage.setItem('ror2-flashcards-stats', JSON.stringify({ bestStreak: 'nope' }))
    expect(loadStats()).toEqual({ bestStreak: 0, bestAccuracy: 0 })
  })

  it('defaults the option count to 4 and only accepts 6 as an override', () => {
    expect(loadOptionCount()).toBe(4)
    saveOptionCount(6)
    expect(loadOptionCount()).toBe(6)
    saveOptionCount(5)
    expect(loadOptionCount()).toBe(4)
  })
})

describe('mode storage', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  it('defaults to Description → Item when nothing is stored', () => {
    expect(loadMode()).toBe('description')
  })

  it('round-trips the selected mode', () => {
    const modes: FlashcardMode[] = ['image', 'description']
    modes.forEach((mode) => {
      saveMode(mode)
      expect(loadMode()).toBe(mode)
    })
  })

  it('falls back to Description → Item on unknown stored values', () => {
    window.localStorage.setItem('ror2-flashcards-mode', 'trivia')
    expect(loadMode()).toBe('description')
    window.localStorage.setItem('ror2-flashcards-mode', 'IMAGE')
    expect(loadMode()).toBe('description')
  })
})
