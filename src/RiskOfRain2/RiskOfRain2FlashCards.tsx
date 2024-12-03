import React, { useEffect } from "react"
import riskOfRainUiState from "./RiskOfRainUiState";
import Button from "./Button";
import { createUseStyles } from "react-jss";
import clsx from "clsx";
import { descriptionParser } from './RiskOfRainBusinessLogic';
import RiskOfRain2ItemTileDescription from "./RiskOfRain2ItemTileDescription";
import RiskOfRainFlashCardOptions from "./RiskOfRainFlashCards/RiskOfRainFlashCardOptions";
import { observer } from "mobx-react-lite";

const useStyles = createUseStyles({
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
  },

  flashCardContainer: {
    padding: 16,
    margin: 16,
    borderRadius: 4,
    background: 'linear-gradient(360deg, rgba(102,95,102,1) 0%, rgba(45,44,42,1) 100%, rgba(102,95,102,1) 0%)',
  },
  flashCard: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  flashCardItemImage: {
    height: '125px',
    width: '125px',
    border: '1px solid grey',
    borderRadius: 4,
  },
  flashCardItemToGuessInfo: {
    fontSize: 24,
    height: 48,
    color: '#ffffff',
  },
  flashCardOptionButton: {
    height: 120,
    width: '50%',
    margin: 8,

    background: '#20388857',
    border: '1px solid #000',
  }
})

type Props = {

};

const RiskOfRain2FlashCards = observer((props: Props) => {
  const styles = useStyles()
  const uiState = riskOfRainUiState
  const items = uiState.filteredList

  const flashCardContainerClasses = clsx(styles.flashCardContainer, styles.flexColumn, styles.flexCenter)
  const flashCardClasses = clsx(styles.flexCenter, styles.flashCard)

  const calculateNewFlashCard = () => {
    uiState.resetCurrentUsedItems()
    uiState.resetItemsGuessed()
    uiState.itemHasBeenGuessed = false
    calculateItemToGuess()
    calculateThreeRandomItems()
    uiState.randomizeItemOrder()
  }

  const calculateItemToGuess = () => {
    const randomIndex = Math.floor(Math.random() * 184)
    const item = items[randomIndex]
    uiState.currentItemToGuess = item
    uiState.addCurrentUsedItem(item)
    return item
  }

  const calculateThreeRandomItems = () => {
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * 184)
      const item = items[randomIndex]
      if (uiState.itemAlreadyPresent(item)) {
        i--
        continue
      }
      uiState.addCurrentUsedItem(item)
    }
  }

  useEffect(calculateNewFlashCard, [])

  return (
    <>
      <div style={{height: 34}}>
        <Button onClick={calculateNewFlashCard}>New</Button>
      </div>

      <div className={flashCardContainerClasses}>
        { uiState.currentUsedItems.length === 4 &&
          <div className={flashCardClasses} style={{width: '100%'}}>

            <div className={styles.flexRow} style={{width: '100%'}}>
              <div className={styles.flexColumn}>
                { uiState.currentItemToGuess.nickname &&
                  <img style={{}} src={require(`./ror2_items_img/${uiState.currentItemToGuess.nickname}.webp`)} />
                }
                <div className={styles.flashCardItemToGuessInfo}>
                  {uiState.itemHasBeenGuessed ? uiState.currentItemToGuess.displayName : ''}
                </div>
              </div>

              {/* Add how to unlock */}
              {/* Play stats would be the next thing to tackle */}

            </div>


            <div className={styles.flexColumn}>
              <RiskOfRainFlashCardOptions />
            </div>
          </div>
        }
      </div>
    </>
  )
});

export default RiskOfRain2FlashCards;
