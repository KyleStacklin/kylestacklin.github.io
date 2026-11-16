import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HashRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import RiskOfRain2 from '../RiskOfRain2'
import riskOfRainUiState from '../RiskOfRainUiState'
import { RARITY_NAMES } from '../RiskOfRain2Types'

const renderApp = () =>
  render(
    <HashRouter>
      <RiskOfRain2 />
    </HashRouter>
  )

// Anchored so item descriptions that merely contain "N items" don't match.
const resultCount = () => screen.getByText(/^\d+ items$/)

beforeEach(() => {
  // The store is a module singleton; reset it through its public actions and
  // clear the persisted state it reads from so every test starts from defaults.
  window.localStorage.clear()
  window.location.hash = '#/'
  riskOfRainUiState.setSearchQuery('')
  riskOfRainUiState.resetFilters()
  riskOfRainUiState.resetDlcs()
  riskOfRainUiState.setDisplayType('grid')
})

afterEach(() => {
  cleanup()
})

describe('item grid', () => {
  it('renders every item by default', () => {
    const { container } = renderApp()
    expect(resultCount()).toHaveTextContent('250 items')
    // Item images have alt text; DLC badge/header logo images do not.
    const itemImages = Array.from(container.querySelectorAll('img')).filter(
      (img) => img.getAttribute('alt')
    )
    expect(itemImages).toHaveLength(250)
    expect(screen.getByRole('heading', { name: 'Ukulele' })).toBeInTheDocument()
  })

  it('filters the grid when typing in the search box', async () => {
    renderApp()
    const user = userEvent.setup()
    const input = screen.getByPlaceholderText('Search items...')

    await user.type(input, 'Ukulele')

    expect(riskOfRainUiState.searchQuery).toBe('Ukulele')
    expect(resultCount()).toHaveTextContent('2 items')
    expect(screen.getByRole('heading', { name: 'Ukulele' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Polylute' })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Repulsion Armor Plate' })
    ).not.toBeInTheDocument()
  })
})

describe('rarity filter pills', () => {
  it('toggling a pill removes and re-adds the filter', async () => {
    renderApp()
    const user = userEvent.setup()
    const legendaryPill = screen.getByRole('button', { name: 'Legendary' })
    expect(riskOfRainUiState.filters.has('Legendary')).toBe(true)
    // Active pills show white text on the rarity color.
    expect(legendaryPill).toHaveStyle({ color: '#ffffff' })

    await user.click(legendaryPill)

    expect(riskOfRainUiState.filters.has('Legendary')).toBe(false)
    expect(resultCount()).toHaveTextContent('214 items')
    expect(legendaryPill).toHaveStyle({ color: '#dfe4ee' })

    await user.click(legendaryPill)

    expect(riskOfRainUiState.filters.has('Legendary')).toBe(true)
    expect(resultCount()).toHaveTextContent('250 items')
    expect(legendaryPill).toHaveStyle({ color: '#ffffff' })
  })

  it('hides the Reset button while filters are default, shows it after removing one and restores all rarities', async () => {
    renderApp()
    expect(screen.queryByRole('button', { name: 'Reset' })).not.toBeInTheDocument()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Legendary' }))
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reset' }))

    expect(riskOfRainUiState.filters.size).toBe(RARITY_NAMES.length)
    expect(riskOfRainUiState.filters.has('Legendary')).toBe(true)
    expect(resultCount()).toHaveTextContent('250 items')
    expect(screen.queryByRole('button', { name: 'Reset' })).not.toBeInTheDocument()
  })
})

describe('view toggle', () => {
  it('clicking List navigates the hash to #/list and renders the list view', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('button', { name: 'List' }))

    expect(window.location.hash).toBe('#/list')
    expect(riskOfRainUiState.displayType).toBe('list')
    expect(screen.getByRole('heading', { name: 'Ukulele' })).toBeInTheDocument()
    // Grid tiles render the nickname alias; list rows do not.
    expect(screen.queryByText('ukulele')).not.toBeInTheDocument()
  })

  it('clicking Flash Cards navigates the hash to #/flashcards and renders the start screen', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('button', { name: 'Flash Cards' }))

    expect(window.location.hash).toBe('#/flashcards')
    expect(riskOfRainUiState.displayType).toBe('flashCards')
    expect(screen.getByText('Item Flashcards')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start session' })).toBeInTheDocument()
  })

  it('visiting #/flashcards directly renders the flashcard start screen', () => {
    window.location.hash = '#/flashcards'
    renderApp()

    expect(screen.getByText('Item Flashcards')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start session' })).toBeInTheDocument()
    expect(screen.getByText('10 questions from 250 items')).toBeInTheDocument()
  })
})

describe('dlc toggles', () => {
  it('toggling a DLC off removes its items from the grid and re-adding restores them', async () => {
    renderApp()
    const user = userEvent.setup()
    const alloyedToggle = screen.getByRole('button', { name: 'Alloyed Collective' })
    expect(riskOfRainUiState.enabledDlcs.has('alloyed')).toBe(true)
    expect(screen.getByRole('heading', { name: 'Eclipse Lite' })).toBeInTheDocument()

    await user.click(alloyedToggle)

    expect(riskOfRainUiState.enabledDlcs.has('alloyed')).toBe(false)
    expect(resultCount()).toHaveTextContent('232 items')
    expect(screen.queryByRole('heading', { name: 'Eclipse Lite' })).not.toBeInTheDocument()

    await user.click(alloyedToggle)

    expect(riskOfRainUiState.enabledDlcs.has('alloyed')).toBe(true)
    expect(resultCount()).toHaveTextContent('250 items')
    expect(screen.getByRole('heading', { name: 'Eclipse Lite' })).toBeInTheDocument()
  })

  it('shows the DLC Reset button only when the selection is non-default and restores all DLCs', async () => {
    renderApp()
    expect(screen.queryByRole('button', { name: 'Reset DLC' })).not.toBeInTheDocument()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Survivors of the Void' }))
    expect(screen.getByRole('button', { name: 'Reset DLC' })).toBeInTheDocument()
    expect(resultCount()).toHaveTextContent('209 items')

    await user.click(screen.getByRole('button', { name: 'Reset DLC' }))

    expect(riskOfRainUiState.enabledDlcs.size).toBe(5)
    expect(resultCount()).toHaveTextContent('250 items')
    expect(screen.queryByRole('button', { name: 'Reset DLC' })).not.toBeInTheDocument()
  })

  it('persists DLC toggles to localStorage', async () => {
    renderApp()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Alloyed Collective' }))

    expect(JSON.parse(window.localStorage.getItem('ror2.v1.dlcs') ?? '[]')).toEqual([
      'base',
      'sotv',
      'sots',
      'hallowed',
    ])

    await user.click(screen.getByRole('button', { name: 'Reset DLC' }))

    expect(JSON.parse(window.localStorage.getItem('ror2.v1.dlcs') ?? '[]')).toEqual([
      'base',
      'sotv',
      'sots',
      'alloyed',
      'hallowed',
    ])
  })

  it('shows a Hallowed Concepts toggle that persists and filters its items', async () => {
    renderApp()
    const user = userEvent.setup()
    const hallowedToggle = screen.getByRole('button', { name: 'Hallowed Concepts' })
    expect(riskOfRainUiState.enabledDlcs.has('hallowed')).toBe(true)
    expect(screen.getByRole('heading', { name: 'Corpse Lily' })).toBeInTheDocument()

    await user.click(hallowedToggle)

    expect(riskOfRainUiState.enabledDlcs.has('hallowed')).toBe(false)
    expect(resultCount()).toHaveTextContent('212 items')
    expect(screen.queryByRole('heading', { name: 'Corpse Lily' })).not.toBeInTheDocument()
    expect(JSON.parse(window.localStorage.getItem('ror2.v1.dlcs') ?? '[]')).toEqual([
      'base',
      'sotv',
      'sots',
      'alloyed',
    ])

    await user.click(hallowedToggle)

    expect(riskOfRainUiState.enabledDlcs.has('hallowed')).toBe(true)
    expect(resultCount()).toHaveTextContent('250 items')
    expect(screen.getByRole('heading', { name: 'Corpse Lily' })).toBeInTheDocument()
  })
})

describe('dlc badges', () => {
  it('shows a DLC logo badge on DLC items and none on base-game items', () => {
    const { container } = renderApp()
    expect(container.querySelectorAll('span[data-dlc="sotv"]')).toHaveLength(41)
    expect(container.querySelectorAll('span[data-dlc="sots"]')).toHaveLength(20)
    expect(container.querySelectorAll('span[data-dlc="alloyed"]')).toHaveLength(18)
    expect(container.querySelectorAll('span[data-dlc="hallowed"]')).toHaveLength(38)
    // Badge spans are the only elements carrying a data-dlc attribute.
    expect(container.querySelectorAll('span[data-dlc]')).toHaveLength(117)
  })

  it('shows a full-name tooltip on badge hover and removes it on leave', () => {
    const { container } = renderApp()
    const badge = container.querySelector('span[data-dlc="sotv"]')
    expect(badge).not.toBeNull()
    expect(document.body.querySelector('[role="tooltip"]')).toBeNull()
    fireEvent.mouseEnter(badge!)
    expect(document.body.querySelector('[role="tooltip"]')!.textContent).toBe('Survivors of the Void')
    fireEvent.mouseLeave(badge!)
    expect(document.body.querySelector('[role="tooltip"]')).toBeNull()
  })
})

describe('item ordering', () => {
  it('sorts the master list by rarity ascending', () => {
    const list = riskOfRainUiState.list
    expect(list).toHaveLength(250)
    for (let i = 1; i < list.length; i++) {
      expect(Number(list[i].rarity)).toBeGreaterThanOrEqual(Number(list[i - 1].rarity))
    }
  })

  it('places appended Alloyed/Hallowed items inside their rarity groups, not at the end', () => {
    const list = riskOfRainUiState.list
    // Eclipse Lite (Alloyed, rarity 0) and the Hallowed rarities 7/8/9 are all
    // appended at the end of ror2_items.json; they must sort back into their
    // rarity groups instead of trailing the grid.
    ;['eclipseLite', 'hexOfStrife', 'corpseLily', 'shreddedPage'].forEach((nickname) => {
      const index = list.findIndex((item) => item.nickname === nickname)
      expect(index).toBeGreaterThan(-1)
      const rarity = Number(list[index].rarity)
      const groupedWithPrev = index > 0 && Number(list[index - 1].rarity) === rarity
      const groupedWithNext = index < list.length - 1 && Number(list[index + 1].rarity) === rarity
      expect(groupedWithPrev || groupedWithNext).toBe(true)
    })
    // The raw JSON keeps them appended last; the store must not.
    const tailRarities = list.slice(-10).map((item) => Number(item.rarity))
    expect(tailRarities).not.toContain(0)
  })
})
