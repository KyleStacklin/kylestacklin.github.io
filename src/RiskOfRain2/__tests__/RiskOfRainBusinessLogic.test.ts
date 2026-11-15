import { describe, expect, it } from 'vitest'
import {
  descriptionParser,
  rarityConverter,
  rarityPillStyle,
  rarityTextToNum,
} from '../RiskOfRainBusinessLogic'

describe('descriptionParser', () => {
  it('wraps {type:text} fragments in a colored span', () => {
    expect(descriptionParser('{offense:25%} chance')).toBe(
      '<span style="color: #ff5252; font-weight: 500;">25%</span> chance'
    )
  })

  it('colors debuff fragments with the debuff color (regression: not black)', () => {
    const html = descriptionParser('{debuff:25% health}')
    expect(html).toBe('<span style="color: #ff7ab8; font-weight: 500;">25% health</span>')
    expect(html).not.toContain('#000')
  })

  it('colors corrupt fragments with the corrupt color (regression: not black)', () => {
    const html = descriptionParser('{corrupt:Corrupts all Tougher Times}')
    expect(html).toBe(
      '<span style="color: #b07ef5; font-weight: 500;">Corrupts all Tougher Times</span>'
    )
    expect(html).not.toContain('#000')
  })

  it('uses the light default color for unknown combat types', () => {
    expect(descriptionParser('{teleport:hop}')).toBe(
      '<span style="color: #dfe4ee; font-weight: 500;">hop</span>'
    )
  })

  it('renders the pipe suffix exactly once (regression: doubled "per stack")', () => {
    expect(descriptionParser('{+25%|per item stack}')).toBe(
      '<span style="color: #c8c8d5">(+25% per item stack)</span>'
    )
  })

  it('appends "per stack" once to plain brace fragments', () => {
    expect(descriptionParser('{+20%}')).toBe(
      '<span style="color: #c8c8d5">(+20% per stack)</span>'
    )
  })

  it('handles a real mixed description (Ukulele)', () => {
    const html = descriptionParser(
      '{offense:25%} chance to fire a {offense:chain lightning} for {offense:80%} TOTAL damage up to {offense:3} {+2} targets within {offense:20m} {+2m}.'
    )
    expect(html).toContain('<span style="color: #ff5252; font-weight: 500;">chain lightning</span>')
    expect(html).toContain('<span style="color: #c8c8d5">(+2 per stack)</span>')
    expect(html).toContain('<span style="color: #c8c8d5">(+2m per stack)</span>')
    expect(html).not.toContain('{')
    expect(html).not.toContain('}')
  })

  it('handles a real pipe description without duplicating the suffix', () => {
    const html = descriptionParser(
      "Every {offense:5} enemies slain grants a damage counter bonus increasing the player's damage by {offense:10%} {+5%|per item stack}, lasting as long as the player stays in combat."
    )
    expect(html).toContain('(+5% per item stack)')
    expect(html.match(/per item stack/g)).toHaveLength(1)
    expect(html).not.toContain('per stack per')
  })

  it('handles a real corrupt description with a plain fragment', () => {
    const html = descriptionParser(
      '{defense:Block} incoming damage once. Recharges after {misc:15 seconds} {-10%}.\n{corrupt:Corrupts all Tougher Times}.'
    )
    expect(html).toContain('<span style="color: #b07ef5; font-weight: 500;">Corrupts all Tougher Times</span>')
    expect(html).toContain('<span style="color: #c8c8d5">(-10% per stack)</span>')
    expect(html).not.toContain('#000')
  })
})

describe('rarityConverter', () => {
  it('maps rarity numbers 0..9 to their strings, colors and backgrounds', () => {
    const expected = [
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
    expected.forEach((rarityString, rarity) => {
      const converted = rarityConverter(rarity)
      expect(converted.rarityString).toBe(rarityString)
      expect(converted.rarityColor).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(converted.background).not.toBe('')
    })
  })

  it('uses the specified colors for the Hallowed Concepts rarities', () => {
    expect(rarityConverter(7).rarityColor).toBe('#D0F820')
    expect(rarityConverter(8).rarityColor).toBe('#9B73F9')
    expect(rarityConverter(9).rarityColor).toBe('#2A8BFF')
  })

  it('uses a solid single-color gradient for the Hallowed Concepts rarities', () => {
    ;[7, 8, 9].forEach((rarity) => {
      const { background, rarityColor } = rarityConverter(rarity)
      const hex = rarityColor.slice(1)
      const solid = `rgba(${parseInt(hex.slice(0, 2), 16)},${parseInt(hex.slice(2, 4), 16)},${parseInt(hex.slice(4, 6), 16)},1)`
      expect(background).toBe(`linear-gradient(90deg, ${solid} 0%, ${solid} 70%, ${solid} 100%)`)
    })
  })

  it('round-trips through rarityTextToNum', () => {
    for (let rarity = 0; rarity <= 9; rarity++) {
      expect(rarityTextToNum(rarityConverter(rarity).rarityString)).toBe(rarity)
    }
  })

  it('returns an empty converter for out-of-range rarities', () => {
    expect(rarityConverter(99)).toEqual({ background: '', rarityString: '', rarityColor: '' })
    expect(rarityTextToNum('Bogus')).toBe(-1)
  })
})

describe('rarityPillStyle (WCAG pill text contrast)', () => {
  it('picks near-black text for the Uncommon green', () => {
    const { rarityColor } = rarityConverter(1)
    expect(rarityColor).toBe('#598D5B')
    expect(rarityPillStyle(rarityColor, true).color).toBe('#171207')
  })

  it('picks white text for the Legendary red', () => {
    const { rarityColor } = rarityConverter(2)
    expect(rarityColor).toBe('#7B0605')
    expect(rarityPillStyle(rarityColor, true).color).toBe('#ffffff')
  })

  it('picks near-black text for every Hallowed Concepts rarity color (>= 4.5:1)', () => {
    ;[7, 8, 9].forEach((rarity) => {
      const { rarityColor } = rarityConverter(rarity)
      expect(rarityPillStyle(rarityColor, true).color).toBe('#171207')
    })
  })

  it('falls back to near-black for an unknown rarity color', () => {
    expect(rarityPillStyle('', true).color).toBe('#171207')
  })

  it('uses translucent background and light text for inactive pills', () => {
    const style = rarityPillStyle('#598D5B', false)
    expect(style.backgroundColor).toBe('#598D5B2b')
    expect(style.border).toBe('1px solid #598D5B77')
    expect(style.color).toBe('#dfe4ee')
  })

  it('keeps the rarity color as the active background', () => {
    const { rarityColor } = rarityConverter(5)
    const style = rarityPillStyle(rarityColor, true)
    expect(style.backgroundColor).toBe(rarityColor)
    expect(style.border).toBe(`1px solid ${rarityColor}`)
  })
})
