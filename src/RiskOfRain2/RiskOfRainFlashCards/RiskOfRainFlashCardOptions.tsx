import React, { useState } from "react"
import Button from "../Button";
import { createUseStyles } from "react-jss";
import RiskOfRain2ItemTileDescription from "../RiskOfRain2ItemTileDescription";
import riskOfRainUiState from "../RiskOfRainUiState";
import { observer } from "mobx-react-lite";
import clsx from 'clsx';

const useStyles = createUseStyles({
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
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
    width: '100%',
    height: '500px',
  },
  flashCard: {
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
    height: '80%',
  },
  flashCardOptionButton: {
    height: 120,
    width: '50%',
    margin: 8,

    background: '#20388857',
    border: '1px solid #000',

    overflow: 'auto',

    '&:hover': {
      background: '#20388487',
    },
  },
  flashCardOptionButtonIncorrect: {
    background: '#88382057 !important',

    '&:hover': {
      background: '#88382057 !important',
    },
  }
})

const RiskOfRainFlashCardOptions = observer(() => {
  const styles = useStyles()
  const uiState = riskOfRainUiState
  const { currentUsedItems, currentItemToGuess, itemsGuessed } = uiState
  const options = currentUsedItems

  const handleOptionSelect = (option: any) => {
    if (option.displayName === currentItemToGuess.displayName) {
      uiState.itemHasBeenGuessed = true
    } else {
      uiState.addItemGuessed(option)
    }
  }

  return (
    <>
      <div className={styles.flexColumn}>
        <div className={styles.flexRow}>
          {options
        .slice(0, 2)
        .map((option, index) => (
          <Button
            key={index}
            className={clsx(styles.flashCardOptionButton, {[styles.flashCardOptionButtonIncorrect]: itemsGuessed.includes(option)})}
            onClick={() => handleOptionSelect(option)}
            onClickPassBack={option}
          >
            <RiskOfRain2ItemTileDescription description={option.description} />
          </Button>
        ))}
        </div>
        <div className={styles.flexRow}>
          {options
        .slice(2, 4)
        .map((option, index) => (
          <Button
            key={index + 2}
            className={clsx(styles.flashCardOptionButton, {[styles.flashCardOptionButtonIncorrect]: itemsGuessed.includes(option)})}
            onClick={() => handleOptionSelect(option)}
            onClickPassBack={option}
          >
            <RiskOfRain2ItemTileDescription description={option.description} />
          </Button>
        ))}
        </div>
      </div>
    </>
  )
});

export default RiskOfRainFlashCardOptions;
