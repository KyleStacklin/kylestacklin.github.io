import React from "react"
import { createUseStyles } from "react-jss"
import Button from "../Button"
import { descriptionParser, rarityConverter, rarityPillStyle } from "../RiskOfRainBusinessLogic"
import { FlashcardStats, MissedItem, accuracyPercent } from "./flashcardUtils"

const useComponentStyles = createUseStyles({
  summaryIn: {
    from: { opacity: 0, transform: 'translateY(8px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  summaryPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    padding: '24px',
    borderRadius: '12px',
    background: 'linear-gradient(180deg, #242b3a 0%, #1a202c 100%)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.35)',
    animation: '$summaryIn 0.25s ease',
  },
  summaryTitle: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#ffffff',
  },
  statsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  statBlock: {
    flex: '1 1 140px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
    padding: '14px 16px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 1.1,
  },
  statLabel: {
    fontSize: '0.6875rem',
    fontWeight: '600',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    color: '#a3adc2',
  },
  statSub: {
    fontSize: '0.75rem',
    color: '#a3adc2',
  },
  recordTag: {
    fontSize: '0.6875rem',
    fontWeight: '700',
    color: '#e8802e',
  },
  sectionTitle: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#ffffff',
  },
  reviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  reviewRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px 14px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  reviewImageFrame: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    padding: '4px',
    boxSizing: 'border-box',
    borderRadius: '8px',
    background: 'rgba(0, 0, 0, 0.35)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  reviewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  reviewContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    minWidth: 0,
    flex: 1,
  },
  reviewNameRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
  },
  reviewName: {
    fontWeight: '700',
    fontSize: '0.875rem',
    color: '#ffffff',
  },
  reviewPill: {
    fontSize: '0.625rem',
    fontWeight: '600',
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    borderRadius: '999px',
    padding: '2px 8px',
    width: 'fit-content',
  },
  reviewDescription: {
    color: '#c3cbd9',
    fontSize: '0.78125rem',
    lineHeight: 1.5,
    whiteSpace: 'pre-line',
  },
  reviewPicked: {
    fontSize: '0.75rem',
    color: '#a3adc2',
  },
  reviewPickedName: {
    color: '#ff8a8a',
    fontWeight: '600',
  },
  perfectNote: {
    fontSize: '0.8125rem',
    fontWeight: '600',
    color: '#35c45d',
  },
  buttonsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    paddingTop: '4px',
  },
})

type Props = {
  correct: number
  total: number
  bestStreak: number
  missed: MissedItem[]
  stats: FlashcardStats
  newRecords: { streak: boolean, accuracy: boolean }
  onPracticeMissed: () => void
  onNewSession: () => void
}

const RiskOfRainFlashCardSummary = ({
  correct,
  total,
  bestStreak,
  missed,
  stats,
  newRecords,
  onPracticeMissed,
  onNewSession,
}: Props) => {
  const componentStyles = useComponentStyles()
  const accuracy = accuracyPercent(correct, total)

  return (
    <div className={componentStyles.summaryPanel}>
      <h2 className={componentStyles.summaryTitle}>Session complete</h2>

      <div className={componentStyles.statsRow}>
        <div className={componentStyles.statBlock}>
          <div className={componentStyles.statValue}>{accuracy}%</div>
          <div className={componentStyles.statLabel}>Accuracy</div>
          <div className={componentStyles.statSub}>{correct} of {total} correct</div>
          {newRecords.accuracy && <div className={componentStyles.recordTag}>New best accuracy</div>}
        </div>
        <div className={componentStyles.statBlock}>
          <div className={componentStyles.statValue}>{bestStreak}</div>
          <div className={componentStyles.statLabel}>Best streak</div>
          <div className={componentStyles.statSub}>All-time: {stats.bestStreak}</div>
          {newRecords.streak && <div className={componentStyles.recordTag}>New best streak</div>}
        </div>
        <div className={componentStyles.statBlock}>
          <div className={componentStyles.statValue}>{missed.length}</div>
          <div className={componentStyles.statLabel}>Missed</div>
          <div className={componentStyles.statSub}>All-time accuracy: {stats.bestAccuracy}%</div>
        </div>
      </div>

      <div className={componentStyles.reviewContent}>
        <div className={componentStyles.sectionTitle}>
          {missed.length > 0 ? `Missed items (${missed.length})` : 'Review'}
        </div>
        {missed.length === 0 ? (
          <div className={componentStyles.perfectNote}>Perfect session. Nothing to review.</div>
        ) : (
          <div className={componentStyles.reviewList}>
            {missed.map((entry, index) => {
              const { rarityString, rarityColor } = rarityConverter(entry.item.rarity)
              return (
                <div className={componentStyles.reviewRow} key={`${entry.item.nickname}-${index}`}>
                  <div className={componentStyles.reviewImageFrame}>
                    <img
                      className={componentStyles.reviewImage}
                      src={require(`../ror2_items_img/${entry.item.nickname}.webp`)}
                      alt={entry.item.displayName}
                    />
                  </div>
                  <div className={componentStyles.reviewContent}>
                    <div className={componentStyles.reviewNameRow}>
                      <span className={componentStyles.reviewName}>{entry.item.displayName}</span>
                      <span className={componentStyles.reviewPill} style={rarityPillStyle(rarityColor)}>
                        {rarityString}
                      </span>
                    </div>
                    <div
                      className={componentStyles.reviewDescription}
                      dangerouslySetInnerHTML={{ __html: descriptionParser(entry.item.description) }}
                    />
                    {entry.picked &&
                      <div className={componentStyles.reviewPicked}>
                        You picked: <span className={componentStyles.reviewPickedName}>{entry.picked.displayName}</span>
                      </div>
                    }
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className={componentStyles.buttonsRow}>
        {missed.length > 0 &&
          <Button onClick={onPracticeMissed} toggleActive={true}>Practice missed items</Button>
        }
        <Button onClick={onNewSession}>New session</Button>
      </div>
    </div>
  )
}

export default RiskOfRainFlashCardSummary
