import React from "react"
import Button from "../Button";
import { createUseStyles } from "react-jss";
import RiskOfRain2ItemTileDescription from "../RiskOfRain2ItemTileDescription";
import riskOfRainUiState from "../RiskOfRainUiState";
import { observer } from "mobx-react-lite";

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

    background: '#767499',
    border: '1px solid #000',

    overflow: 'auto',
  }
})

const RiskOfRainFlashCardOptions = observer(() => {
  const styles = useStyles()
  const uiState = riskOfRainUiState
  const options = uiState.currentUsedItems
  const correctItem = options[0]

  const handleOptionSelect = (option: any) => {
    console.log(option);
    if (option.displayName === correctItem.displayName) {
      uiState.itemHasBeenGuessed = true
      console.log('Correct!');
    } else {
      console.log('Incorrect!');
    }
  }

  return (
    <>
      <div className={styles.flexColumn}>
        <div className={styles.flexRow}>
          {options
        .slice(0, 2)
        .sort(() => Math.random() - 0.5)
        .map((option, index) => (
          <Button
            key={index}
            className={styles.flashCardOptionButton}
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
        .sort(() => Math.random() - 0.5)
        .map((option, index) => (
          <Button
            key={index + 2}
            className={styles.flashCardOptionButton}
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
