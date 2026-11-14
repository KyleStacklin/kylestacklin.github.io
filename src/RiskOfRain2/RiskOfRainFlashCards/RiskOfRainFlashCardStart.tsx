import React from "react"
import { createUseStyles } from "react-jss"
import Button from "../Button"
import { FlashcardStats } from "./flashcardUtils"

const useComponentStyles = createUseStyles({
  startIn: {
    from: { opacity: 0, transform: 'translateY(8px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  startPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '32px 24px',
    borderRadius: '12px',
    background: 'linear-gradient(180deg, #242b3a 0%, #1a202c 100%)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.35)',
    textAlign: 'center',
    animation: '$startIn 0.25s ease',
  },
  startTitle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: '700',
    color: '#ffffff',
  },
  startSubtitle: {
    fontSize: '13.5px',
    color: '#a3adc2',
    maxWidth: '440px',
    lineHeight: 1.5,
  },
  difficultyRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '8px',
  },
  difficultyLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#a3adc2',
  },
  sessionInfo: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#c3cbd9',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '999px',
    padding: '3px 12px',
  },
  statsLine: {
    fontSize: '12px',
    color: '#a3adc2',
  },
  statsValue: {
    color: '#e8802e',
    fontWeight: '700',
  },
  keyHint: {
    fontSize: '11px',
    color: '#a3adc2',
  },
  kbd: {
    fontFamily: 'monospace',
    fontSize: '10px',
    padding: '1px 5px',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#c3cbd9',
  },
})

type Props = {
  optionCount: number
  onChangeOptionCount: (count: number) => void
  sessionLength: number
  poolSize: number
  poolIsFiltered: boolean
  stats: FlashcardStats
  onStart: () => void
}

const RiskOfRainFlashCardStart = ({
  optionCount,
  onChangeOptionCount,
  sessionLength,
  poolSize,
  poolIsFiltered,
  stats,
  onStart,
}: Props) => {
  const componentStyles = useComponentStyles()
  const hasRecords = stats.bestStreak > 0 || stats.bestAccuracy > 0

  return (
    <div className={componentStyles.startPanel}>
      <h2 className={componentStyles.startTitle}>Item Flashcards</h2>
      <div className={componentStyles.startSubtitle}>
        Read the item description and guess which item it belongs to. The deck is shuffled every session.
      </div>

      <div className={componentStyles.difficultyRow}>
        <span className={componentStyles.difficultyLabel}>Answers per question:</span>
        {[4, 6].map((count) => (
          <Button
            key={count}
            onClick={onChangeOptionCount}
            onClickPassBack={count}
            toggle={true}
            toggleActive={optionCount === count}
          >
            {`${count}`}
          </Button>
        ))}
      </div>

      <span className={componentStyles.sessionInfo}>
        {sessionLength} question{sessionLength === 1 ? '' : 's'} from {poolSize} item{poolSize === 1 ? '' : 's'}
        {poolIsFiltered ? ' (filtered)' : ''}
      </span>

      {hasRecords &&
        <div className={componentStyles.statsLine}>
          Best streak <span className={componentStyles.statsValue}>{stats.bestStreak}</span>
          {' '}· Best accuracy <span className={componentStyles.statsValue}>{stats.bestAccuracy}%</span>
        </div>
      }

      <Button onClick={onStart} toggleActive={true}>Start session</Button>

      <div className={componentStyles.keyHint}>
        Press <kbd className={componentStyles.kbd}>Enter</kbd> to start · answer with number keys
      </div>
    </div>
  )
}

export default RiskOfRainFlashCardStart
