import React from "react"
import { createUseStyles } from "react-jss"
import clsx from "clsx"
import { descriptionParser } from "../RiskOfRainBusinessLogic"
import { FlashcardItem } from "./flashcardUtils"

const useComponentStyles = createUseStyles({
  optionsIn: {
    from: { opacity: 0, transform: 'translateY(6px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '10px',
    width: '100%',
    animation: '$optionsIn 0.22s ease',
    '@media (max-width: 640px)': {
      gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    },
  },
  option: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px 14px',
    borderRadius: '10px',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
    border: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer',
    textAlign: 'left',
    color: '#c3cbd9',
    fontFamily: 'inherit',
    minWidth: 0,
    transition: 'transform 0.15s ease, border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',
    '&:not(:disabled):hover': {
      transform: 'translateY(-2px)',
      borderColor: 'rgba(255,255,255,0.25)',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
    },
    '&:focus-visible': {
      outline: '2px solid #e8802e',
      outlineOffset: '2px',
    },
  },
  optionNumber: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '22px',
    height: '22px',
    marginTop: '1px',
    borderRadius: '6px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#a3adc2',
    fontSize: '11px',
    fontWeight: '700',
    lineHeight: 1,
    transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease',
  },
  optionDescription: {
    flex: 1,
    minWidth: 0,
    color: '#c3cbd9',
    fontSize: '12.5px',
    lineHeight: 1.5,
    whiteSpace: 'pre-line',
  },
  optionCorrect: {
    borderColor: '#35c45d',
    background: 'linear-gradient(180deg, rgba(53,196,93,0.16) 0%, rgba(53,196,93,0.06) 100%)',
  },
  optionNumberCorrect: {
    background: '#35c45d',
    borderColor: '#35c45d',
    color: '#0d2413',
  },
  optionWrong: {
    borderColor: '#ff5252',
    background: 'linear-gradient(180deg, rgba(255,82,82,0.14) 0%, rgba(255,82,82,0.05) 100%)',
  },
  optionNumberWrong: {
    background: '#ff5252',
    borderColor: '#ff5252',
    color: '#2b0d0d',
  },
  optionDimmed: {
    opacity: 0.45,
  },
})

type Props = {
  options: FlashcardItem[]
  correctItem: FlashcardItem
  selectedItem: FlashcardItem | null
  answered: boolean
  onPick: (item: FlashcardItem) => void
}

const RiskOfRainFlashCardOptions = ({ options, correctItem, selectedItem, answered, onPick }: Props) => {
  const componentStyles = useComponentStyles()

  const isCorrectOption = (option: FlashcardItem) => option.nickname === correctItem.nickname
  const isPickedOption = (option: FlashcardItem) =>
    selectedItem !== null && option.nickname === selectedItem.nickname

  const optionClasses = (option: FlashcardItem) =>
    clsx(
      componentStyles.option,
      answered && isCorrectOption(option) && componentStyles.optionCorrect,
      answered && isPickedOption(option) && !isCorrectOption(option) && componentStyles.optionWrong,
      answered && !isCorrectOption(option) && !isPickedOption(option) && componentStyles.optionDimmed
    )

  const numberClasses = (option: FlashcardItem) =>
    clsx(
      componentStyles.optionNumber,
      answered && isCorrectOption(option) && componentStyles.optionNumberCorrect,
      answered && isPickedOption(option) && !isCorrectOption(option) && componentStyles.optionNumberWrong
    )

  return (
    <div className={componentStyles.optionsGrid}>
      {options.map((option, index) => (
        <button
          key={option.nickname}
          type="button"
          className={optionClasses(option)}
          disabled={answered}
          onClick={() => onPick(option)}
        >
          <span className={numberClasses(option)}>{index + 1}</span>
          <span
            className={componentStyles.optionDescription}
            dangerouslySetInnerHTML={{ __html: descriptionParser(option.description) }}
          />
        </button>
      ))}
    </div>
  )
}

export default RiskOfRainFlashCardOptions
