import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import RiskOfRain2FlashCards from '../RiskOfRain2FlashCards'
import riskOfRainUiState from '../RiskOfRainUiState'
import { loadMode } from '../RiskOfRainFlashCards/flashcardUtils'

const MODE_KEY = 'ror2-flashcards-mode'

// Searching "ukulele" matches exactly two items (Ukulele and Polylute, whose
// description mentions Ukuleles), so every session has both items as options
// and the assertions below are fully deterministic.
const narrowPool = () => riskOfRainUiState.setSearchQuery('ukulele')

const startSession = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'Start session' }))
}

// nickname → displayName for the narrowed pool
const POOL_NICKNAMES: Record<string, string> = {
  ukulele: 'Ukulele',
  corruptedThing: 'Polylute',
}

// Both pool descriptions contain this phrase; it must never appear inside a
// Mode 1 option tile (that would repeat the question next to the answer).
const DESCRIPTION_PHRASE = 'chance to fire'
const RARITY_PILL = /^(Common|Uncommon|Legendary|Boss|Void|Lunar|Equipment)$/

beforeEach(() => {
  window.localStorage.clear()
  narrowPool()
})

afterEach(() => {
  cleanup()
})

describe('mode selection', () => {
  it('defaults to Description → Item when nothing is stored', () => {
    render(<RiskOfRain2FlashCards />)
    expect(loadMode()).toBe('description')
    expect(screen.getByRole('button', { name: 'Description → Item' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Image → Description' })).toBeInTheDocument()
  })

  it('persists the selected mode to localStorage and restores it on the next visit', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<RiskOfRain2FlashCards />)

    await user.click(screen.getByRole('button', { name: 'Image → Description' }))
    expect(window.localStorage.getItem(MODE_KEY)).toBe('image')

    unmount()
    render(<RiskOfRain2FlashCards />)
    await startSession(user)

    // Restored mode is image: the question card renders the item icon.
    expect(screen.getByTestId('flashcard-question-image')).toBeInTheDocument()
  })

  it('switching back to Description → Item is persisted too', async () => {
    const user = userEvent.setup()
    render(<RiskOfRain2FlashCards />)

    await user.click(screen.getByRole('button', { name: 'Image → Description' }))
    await user.click(screen.getByRole('button', { name: 'Description → Item' }))

    expect(window.localStorage.getItem(MODE_KEY)).toBe('description')
  })
})

describe('Mode 1 (Description → Item)', () => {
  it('question card shows only the description — no item image and no item name', async () => {
    const user = userEvent.setup()
    render(<RiskOfRain2FlashCards />)
    await startSession(user)

    const questionCard = screen.getByTestId('flashcard-question')
    // No image of the correct answer (or any image) in the question card.
    expect(questionCard.querySelectorAll('img')).toHaveLength(0)
    // Neither candidate item's name appears in the question card.
    expect(within(questionCard).queryByText('Ukulele')).toBeNull()
    expect(within(questionCard).queryByText('Polylute')).toBeNull()
    // The question is the parsed description.
    expect(within(questionCard).getByText(new RegExp(DESCRIPTION_PHRASE, 'i'))).toBeInTheDocument()
  })

  it('options are item tiles with icon, name and rarity pill — never the description text', async () => {
    const user = userEvent.setup()
    render(<RiskOfRain2FlashCards />)
    await startSession(user)

    const options = screen.getAllByTestId('flashcard-option')
    expect(options).toHaveLength(2)
    const names = new Set<string>()
    options.forEach((option) => {
      const images = within(option).getAllByRole('img')
      expect(images).toHaveLength(1)
      names.add(images[0].getAttribute('alt') ?? '')
      // Option tiles must not repeat the question text.
      expect(option.textContent).not.toContain(DESCRIPTION_PHRASE)
      // Every tile shows a rarity pill.
      expect(within(option).getByText(RARITY_PILL)).toBeInTheDocument()
    })
    expect(names).toEqual(new Set(['Ukulele', 'Polylute']))
    // Icon srcs point at the item images.
    options.forEach((option) => {
      const alt = within(option).getByRole('img').getAttribute('alt') ?? ''
      const src = within(option).getByRole('img').getAttribute('src') ?? ''
      expect(src).toContain(Object.keys(POOL_NICKNAMES).find((n) => POOL_NICKNAMES[n] === alt) ?? '')
    })
  })

  it('keyboard flow: 1..N answers, wrong keys are ignored, Enter/Space advances, session ends in summary', async () => {
    const user = userEvent.setup()
    render(<RiskOfRain2FlashCards />)
    await startSession(user)

    // A number beyond the option count does nothing.
    await user.keyboard('9')
    expect(screen.queryByTestId('flashcard-reveal')).toBeNull()

    // Answer question 1 with key "1".
    await user.keyboard('1')
    const reveal = screen.getByTestId('flashcard-reveal')
    const pickedName =
      within(screen.getAllByTestId('flashcard-option')[0]).getByRole('img').getAttribute('alt') ?? ''
    const askedName = within(reveal).getByRole('img').getAttribute('alt') ?? ''
    expect(Object.values(POOL_NICKNAMES)).toContain(askedName)
    const verdict = within(reveal).getByText(/^(Correct|Wrong)$/)
    expect(verdict.textContent).toBe(askedName === pickedName ? 'Correct' : 'Wrong')
    // The reveal shows the full detail: name and rarity pill.
    expect(within(reveal).getByText(askedName)).toBeInTheDocument()
    expect(within(reveal).getByText(RARITY_PILL)).toBeInTheDocument()
    // Options are locked after answering.
    expect(screen.getAllByTestId('flashcard-option')[0]).toBeDisabled()

    // Enter advances to question 2.
    await user.keyboard('{Enter}')
    expect(screen.queryByTestId('flashcard-reveal')).toBeNull()
    expect(screen.getAllByTestId('flashcard-option')[0]).toBeEnabled()

    // Answer question 2 with key "2", then advance with Space.
    await user.keyboard('2')
    expect(screen.getByTestId('flashcard-reveal')).toBeInTheDocument()
    await user.keyboard(' ')

    // Both questions answered → summary.
    expect(screen.getByText('Session complete')).toBeInTheDocument()
    expect(screen.getByText(/\d of 2 correct/)).toBeInTheDocument()
  })
})

describe('Mode 2 (Image → Description)', () => {
  const startInImageMode = async (user: ReturnType<typeof userEvent.setup>) => {
    render(<RiskOfRain2FlashCards />)
    await user.click(screen.getByRole('button', { name: 'Image → Description' }))
    await startSession(user)
  }

  const askedNickname = () => {
    const src = screen.getByTestId('flashcard-question-image').getAttribute('src') ?? ''
    const match = src.match(/\/([A-Za-z]+)\.webp$/)
    return match?.[1] ?? ''
  }

  it('question card shows only the item icon — the item name and alias never appear', async () => {
    const user = userEvent.setup()
    await startInImageMode(user)

    const questionCard = screen.getByTestId('flashcard-question')
    // Exactly one image: the item icon, large and centered.
    expect(questionCard.querySelectorAll('img')).toHaveLength(1)
    // The accessible name must stay empty so the answer never leaks.
    const image = screen.getByTestId('flashcard-question-image')
    expect(image.getAttribute('alt')).toBe('')
    expect(image.getAttribute('src')).toMatch(/\/(ukulele|corruptedThing)\.webp$/)
    // No name text anywhere in the question card.
    expect(within(questionCard).queryByText('Ukulele')).toBeNull()
    expect(within(questionCard).queryByText('Polylute')).toBeNull()
    // And no description text in the question card either.
    expect(questionCard.textContent).not.toContain(DESCRIPTION_PHRASE)
  })

  it('options render candidate descriptions — no images and no item names', async () => {
    const user = userEvent.setup()
    await startInImageMode(user)

    const options = screen.getAllByTestId('flashcard-option')
    expect(options).toHaveLength(2)
    options.forEach((option) => {
      expect(option.querySelectorAll('img')).toHaveLength(0)
      expect(within(option).queryByText('Ukulele')).toBeNull()
      expect(within(option).queryByText('Polylute')).toBeNull()
      // Each option is a parsed description.
      expect(option.textContent).toContain(DESCRIPTION_PHRASE)
    })
    // The two candidate descriptions are distinct.
    expect(options[0].textContent).not.toBe(options[1].textContent)
  })

  it('answering reveals the full item detail including the description', async () => {
    const user = userEvent.setup()
    await startInImageMode(user)
    const asked = askedNickname()

    await user.click(screen.getAllByTestId('flashcard-option')[0])

    const reveal = screen.getByTestId('flashcard-reveal')
    const revealedName = within(reveal).getByRole('img').getAttribute('alt') ?? ''
    expect(Object.values(POOL_NICKNAMES)).toContain(revealedName)
    // The reveal is for the item that was asked about.
    expect(within(reveal).getByRole('img').getAttribute('src')).toContain(asked)
    expect(within(reveal).getByText(revealedName)).toBeInTheDocument()
    expect(within(reveal).getByText(RARITY_PILL)).toBeInTheDocument()
    // Image mode reveals the description so the answer can be verified.
    expect(within(reveal).getByText(new RegExp(DESCRIPTION_PHRASE, 'i'))).toBeInTheDocument()
  })
})
