import React from "react"
import { createUseStyles } from "react-jss"
import clsx from "clsx"
import Button from "../Button"
import { accuracyPercent } from "./flashcardUtils"

const useComponentStyles = createUseStyles({
  hud: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    padding: '10px 14px',
    borderRadius: '12px',
    background: 'linear-gradient(180deg, #242b3a 0%, #1a202c 100%)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.35)',
  },
  hudCounter: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#c3cbd9',
    whiteSpace: 'nowrap',
  },
  progressTrack: {
    flex: '1 1 120px',
    height: '6px',
    minWidth: '80px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '999px',
    background: '#e8802e',
    transition: 'width 0.3s ease',
  },
  chip: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#c3cbd9',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '999px',
    padding: '3px 10px',
    whiteSpace: 'nowrap',
  },
  chipLabel: {
    color: '#a3adc2',
    fontWeight: '500',
  },
  chipAccent: {
    color: '#e8802e',
  },
  endButton: {
    marginLeft: 'auto',
  },
})

type Props = {
  questionNumber: number
  totalQuestions: number
  correct: number
  answered: number
  streak: number
  bestStreak: number
  onEndSession: () => void
}

const RiskOfRainFlashCardHud = ({
  questionNumber,
  totalQuestions,
  correct,
  answered,
  streak,
  bestStreak,
  onEndSession,
}: Props) => {
  const componentStyles = useComponentStyles()
  const accuracy = answered > 0 ? `${accuracyPercent(correct, answered)}%` : '—'
  const progress = totalQuestions > 0 ? Math.round((answered / totalQuestions) * 100) : 0

  return (
    <div className={componentStyles.hud}>
      <span className={componentStyles.hudCounter}>
        Question {questionNumber} of {totalQuestions}
      </span>
      <div className={componentStyles.progressTrack}>
        <div className={componentStyles.progressFill} style={{ width: `${progress}%` }} />
      </div>
      <span className={componentStyles.chip}>
        <span className={componentStyles.chipLabel}>Score</span>
        {correct}/{answered} · {accuracy}
      </span>
      <span className={componentStyles.chip}>
        <span className={componentStyles.chipLabel}>Streak</span>
        <span className={clsx({ [componentStyles.chipAccent]: streak > 0 })}>{streak}</span>
        <span className={componentStyles.chipLabel}>Best {bestStreak}</span>
      </span>
      <Button className={componentStyles.endButton} onClick={onEndSession}>End session</Button>
    </div>
  )
}

export default RiskOfRainFlashCardHud
