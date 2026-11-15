export type FlashcardItem = {
  displayName: string
  nickname: string
  rarity: number
  description: string
  itemNumber: number
  unlockTask: string | null
}

export type FlashcardQuestion = {
  item: FlashcardItem
  options: FlashcardItem[]
}

// 'description': the question shows the parsed item description, options are
// item image tiles. 'image': the question shows the item icon, options are
// candidate descriptions. The question/options pair must never reveal the
// answer in both places at once.
export type FlashcardMode = 'description' | 'image'

export type MissedItem = {
  item: FlashcardItem
  picked: FlashcardItem | null
}

export type FlashcardStats = {
  bestStreak: number
  bestAccuracy: number
}

export const accuracyPercent = (correct: number, total: number): number =>
  total === 0 ? 0 : Math.round((correct / total) * 100)

export const shuffle = <T,>(input: T[]): T[] => {
  const array = [...input]
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const swapped = array[i]
    array[i] = array[j]
    array[j] = swapped
  }
  return array
}

export const buildQuestions = (
  pool: FlashcardItem[],
  sessionLength: number,
  optionsPerQuestion: number
): FlashcardQuestion[] => {
  const deck = shuffle(pool)
  const questions: FlashcardQuestion[] = []
  const optionTotal = Math.min(optionsPerQuestion, deck.length)
  for (let i = 0; i < Math.min(sessionLength, deck.length); i++) {
    const item = deck[i]
    const distractors = shuffle(
      deck.filter((candidate) => candidate.nickname !== item.nickname)
    ).slice(0, optionTotal - 1)
    questions.push({ item, options: shuffle([item, ...distractors]) })
  }
  return questions
}

const STATS_KEY = 'ror2-flashcards-stats'
const OPTION_COUNT_KEY = 'ror2-flashcards-option-count'
const MODE_KEY = 'ror2-flashcards-mode'

const readStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(key)
  } catch (error) {
    return null
  }
}

const writeStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, value)
  } catch (error) {
    return
  }
}

export const loadStats = (): FlashcardStats => {
  const raw = readStorage(STATS_KEY)
  if (!raw) return { bestStreak: 0, bestAccuracy: 0 }
  try {
    const parsed = JSON.parse(raw)
    return {
      bestStreak: typeof parsed?.bestStreak === 'number' ? parsed.bestStreak : 0,
      bestAccuracy: typeof parsed?.bestAccuracy === 'number' ? parsed.bestAccuracy : 0,
    }
  } catch (error) {
    return { bestStreak: 0, bestAccuracy: 0 }
  }
}

export const saveStats = (stats: FlashcardStats): void => {
  writeStorage(STATS_KEY, JSON.stringify(stats))
}

export const loadOptionCount = (): number => {
  return readStorage(OPTION_COUNT_KEY) === '6' ? 6 : 4
}

export const saveOptionCount = (count: number): void => {
  writeStorage(OPTION_COUNT_KEY, String(count))
}

export const loadMode = (): FlashcardMode => {
  return readStorage(MODE_KEY) === 'image' ? 'image' : 'description'
}

export const saveMode = (mode: FlashcardMode): void => {
  writeStorage(MODE_KEY, mode)
}
