import riskOfRainUiState from "./RiskOfRainUiState"

type RarityConverter = { background: string, rarityString: string, rarityColor: string }

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
      return '#f02929'
    case 'defense':
      return '#00aa00'
    case 'misc':
      return '#c4cb4a'
    default:
      return '#000'
  }
}

export const descriptionParser = (description: string) => {
  let color = '#000'
  // Handle {} with colon by removing {}
  const withColonProcessed =
    description.replace(/{([^:{}]+):([^{}]+)}/g, (_, beforeColon, afterColon) => {
      color = combatTypeColor(beforeColon)
      return `<span style="color: ${color}; font-weight: 500;">${afterColon}</span>`
    })

  // Handle {} without colon by adding () around the text and "per stack"
  const finalResult =
    withColonProcessed.replace(/{([^:{}]+)}/g, (_, innerText) =>
      `<span style="color: #c8c8d5">(${innerText} per stack)</span>`
    )

  
  return finalResult;
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