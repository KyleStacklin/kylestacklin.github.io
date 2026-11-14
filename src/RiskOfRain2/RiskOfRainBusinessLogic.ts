import type { CSSProperties } from "react"
import riskOfRainUiState from "./RiskOfRainUiState"

type RarityConverter = { background: string, rarityString: string, rarityColor: string }

// WCAG contrast: picks white or near-black text so small pill labels stay >= 4.5:1
const pickPillTextColor = (backgroundColor: string): string => {
  const channels = [0, 2, 4].map(i => parseInt(backgroundColor.replace('#', '').slice(i, i + 2), 16) / 255)
    .map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
  const luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
  const white = 1.05 / (luminance + 0.05)
  return white >= 4.5 ? '#ffffff' : '#171207'
}

// Shared pill style used by tiles, list rows and the header rarity filters
export const rarityPillStyle = (rarityColor: string, active = false): CSSProperties =>
  active
    ? { backgroundColor: rarityColor, border: `1px solid ${rarityColor}`, color: pickPillTextColor(rarityColor) }
    : { backgroundColor: `${rarityColor}2b`, border: `1px solid ${rarityColor}77`, color: '#dfe4ee' }

export const rarityConverter = (rarityNumber: number): RarityConverter => {
  switch (rarityNumber) {
    case 0:
      return {
        background: 'linear-gradient(90deg, rgba(91,98,94,1) 0%, rgba(91,98,94,1) 70%, rgba(91,98,94,1) 100%)',
        rarityString: 'Common',
        rarityColor: '#5B625E'
      }
    case 1:
      return {
        background: 'linear-gradient(90deg, rgba(88, 140, 90, 1) 0%, rgba(88, 140, 90, 1) 70%, rgba(88, 140, 90, 1) 100%)',
        rarityString: 'Uncommon',
        rarityColor: '#598D5B'
      }
    case 2:
      return {
        background: 'linear-gradient(90deg, rgba(123,6,5,1) 0%, rgba(123,6,5,1) 70%, rgba(123,6,5,1) 100%)',
        rarityString: 'Legendary',
        rarityColor: '#7B0605'
      }
    case 3:
      return {
        background: 'linear-gradient(90deg, rgba(107,115,25,1) 0%, rgba(107,115,25,1) 70%, rgba(107,115,25,1) 100%)',
        rarityString: 'Boss',
        rarityColor: '#6B7319'
      }
    case 4:
      return {
        background: 'linear-gradient(90deg, rgba(104,23,117,1) 0%, rgba(90,18,99,1) 70%, rgba(76,15,95,1) 100%)',
        rarityString: 'Void',
        rarityColor: '#641572'
      }
    case 5:
      return {
        background: 'rgb(12 129 150)',
        rarityString: 'Lunar',
        rarityColor: '#178599'
      }
    case 6:
      return {
        background: 'linear-gradient(90deg, rgba(115,77,18,1) 0%, rgba(115,77,18,1) 70%, rgba(115,77,18,1) 100%)',
        rarityString: 'Equipment',
        rarityColor: '#734D12'
      }
    default:
      return { background: '', rarityString: '', rarityColor: '' };
  }
}

export const rarityTextToNum = (rarityText: string) => {
  switch (rarityText) {
    case 'Common':
      return 0
    case 'Uncommon':
      return 1
    case 'Legendary':
      return 2
    case 'Boss':
      return 3
    case 'Void':
      return 4
    case 'Lunar':
      return 5
    case 'Equipment':
      return 6
    default:
      return -1
  }
}

const combatTypeColor = (combatType: string) => {
  switch (combatType) {
    case 'offense':
      return '#ff5252'
    case 'defense':
      return '#35c45d'
    case 'misc':
      return '#c4cb4a'
    case 'debuff':
      return '#ff7ab8'
    case 'corrupt':
      return '#b07ef5'
    default:
      return '#dfe4ee'
  }
}

export const descriptionParser = (description: string) => {
  // Handle {type:text} by wrapping the text in a colored span
  const withColonProcessed =
    description.replace(/{([^:{}]+):([^{}]+)}/g, (_, combatType, text) =>
      `<span style="color: ${combatTypeColor(combatType)}; font-weight: 500;">${text}</span>`
    )

  // Handle {text|suffix} by adding () around the text with the custom suffix
  const withPipeProcessed =
    withColonProcessed.replace(/{([^:{}|]+)\|([^{}]+)}/g, (_, text, suffix) =>
      `<span style="color: #c8c8d5">(${text} ${suffix})</span>`
    )

  // Handle {text} by adding () around the text and "per stack"
  const finalResult =
    withPipeProcessed.replace(/{([^:{}]+)}/g, (_, text) =>
      `<span style="color: #c8c8d5">(${text} per stack)</span>`
    )

  return finalResult
}


// Tier List
export const tierListTierColor = (tier: string) => {
  const tierColors = {
    S: '#FE7F7E',
    A: '#FEBF7E',
    B: '#FEFF7F',
    C: '#7FFF7F',
    F: '#FF7FFE',
  }
  return tierColors[tier as keyof typeof tierColors]
}

export const getTierListForCharacter = (character: string) => {
  const uiState = riskOfRainUiState
  const list = uiState.filteredList
  const tierList = {
    S: [] as any[],
    A: [] as any[],
    B: [] as any[],
    C: [] as any[],
    F: [] as any[],
  }
  list.forEach((item) => {
    if (item.tierList?.all) {
      tierList[item.tierList.all as keyof typeof tierList].push(item)
    } else if (item.tierList && item.tierList[character]) {
      tierList[item.tierList[character] as keyof typeof tierList].push(item)
    }
  })
  return tierList
}