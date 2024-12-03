import React from "react"
import { useStyles } from "./useStyles";
import { getTierListForCharacter, tierListTierColor } from './RiskOfRainBusinessLogic';
import clsx from "clsx";
import riskOfRainUiState from "./RiskOfRainUiState";
import { observer } from "mobx-react-lite";

type Props = {

};

const RiskOfRain2TierList = observer((props: Props) => {
  const styles = useStyles()
  const uiState = riskOfRainUiState

  const tierList = getTierListForCharacter(uiState.tierListSelectedCharacter)
  console.log(tierList);

  const characters = [
    'Commando',
    'Huntress',
    'Bandit',
    'MUL-T',
    'Engineer',
    'Artificer',
    'Mercenary',
    'Rex',
    'Loader',
    'Acrid',
    'Captain',
  ]
  // rest of dlc images: https://riskofrain2.fandom.com/wiki/Survivors
  const dlcCharacters = [
    'Railgunner',
    'Void_Fiend'
  ]
  const allCharacters = [...characters, ...dlcCharacters]
  const half = Math.ceil(allCharacters.length / 2);
  const firstHalf = allCharacters.slice(0, half);
  const secondHalf = allCharacters.slice(half);
  const characterImageClick = (character: string) => {
    uiState.tierListSelectedCharacter = character
  }

  const tiers = ['S', 'A', 'B', 'C', 'F']

  const characterColumn = (characters: string[]) => {
    const classes = clsx(styles.flexColumn, styles.flexCenterY, styles.gap8)
    return (
      <div className={classes}>
        { characters.map((character, i) => {
          const selected = uiState.tierListSelectedCharacter === character
          const isDlc = dlcCharacters.includes(character)
          const characterPath = selected ? `${character}_Selected.png` : `${character}.webp`
          const characterClasses = clsx(
            styles.tierListCharacter,
            {[styles.tierListCharacterDLC]: isDlc},
            {[styles.tierListCharacterSelected]: isDlc && selected}
          )
          return (
            <img
              key={i}
              draggable={false}
              className={characterClasses}
              src={require(`./ror2_characters_img/${characterPath}`)}
              onClick={() => characterImageClick(character)}
            />
          )
        })
        }
      </div>
    )
  }

  const tierListContainerClasses = clsx(
    styles.flexRow,
    styles.padding16X,
    styles.gap16
  )
  const characterListClasses = clsx(
    styles.flexRow,
    styles.gap8
  )
  const tierListClasses = clsx(
    styles.flexColumn,
    styles.gap4,
    styles.tierList,
  )
  const tierListRowClasses = clsx(
    styles.flexRow,
    styles.gap8,
    styles.tierListRow
  )

  return (
    <div className={tierListContainerClasses}>

      <div className={characterListClasses}>
        <div className={styles.flexColumn}>{characterColumn(firstHalf)}</div>
        <div className={styles.flexColumn}>{characterColumn(secondHalf)}</div>
      </div>

      <div className={tierListClasses}>
        { tiers.map((tier, i) => {
            return (
              <div key={i} className={tierListRowClasses}>
                <div
                  className={styles.tierListTier}
                  style={{background: tierListTierColor(tier)}}
                >
                  {tier}
                </div>
                <div className={styles.tierListContents}>
                  {
                    tierList[tier as keyof typeof tierList].map((item, i) => {
                      return (
                        <img
                          key={i}
                          className={styles.tierListItem}
                          src={require(`./ror2_items_img/${item.nickname}.webp`)}
                        />
                      )
                    })
                  }
                </div>
              </div>
            )
          })
        }
      </div>

    </div>
  )
});

export default RiskOfRain2TierList;
