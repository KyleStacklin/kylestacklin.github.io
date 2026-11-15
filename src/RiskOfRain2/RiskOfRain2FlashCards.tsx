import React, { useEffect, useRef, useState } from "react"
import { createUseStyles } from "react-jss"
import clsx from "clsx"
import { observer } from "mobx-react-lite"
import Button from "./Button"
import riskOfRainUiState from "./RiskOfRainUiState"
import { descriptionParser, rarityConverter, rarityPillStyle } from "./RiskOfRainBusinessLogic"
import RiskOfRainFlashCardOptions from "./RiskOfRainFlashCards/RiskOfRainFlashCardOptions"
import RiskOfRainFlashCardHud from "./RiskOfRainFlashCards/RiskOfRainFlashCardHud"
import RiskOfRainFlashCardStart from "./RiskOfRainFlashCards/RiskOfRainFlashCardStart"
import RiskOfRainFlashCardSummary from "./RiskOfRainFlashCards/RiskOfRainFlashCardSummary"
import {
  FlashcardItem,
  FlashcardMode,
  FlashcardQuestion,
  MissedItem,
  FlashcardStats,
  accuracyPercent,
  buildQuestions,
  loadMode,
  loadOptionCount,
  loadStats,
  saveMode,
  saveOptionCount,
  saveStats,
} from "./RiskOfRainFlashCards/flashcardUtils"

const SESSION_LENGTH = 10

type Phase = 'setup' | 'question' | 'feedback' | 'summary'

const CORRECT_COLOR = '#35c45d'
const WRONG_COLOR = '#ff5252'

const useComponentStyles = createUseStyles({
  cardIn: {
    from: { opacity: 0, transform: 'translateY(8px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  flashcardsRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '14px',
    width: '100%',
  },
  gameColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    maxWidth: '760px',
  },
  panel: {
    background: 'linear-gradient(180deg, #242b3a 0%, #1a202c 100%)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.35)',
  },
  questionCard: {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    padding: '22px 24px',
    animation: '$cardIn 0.22s ease',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: '#e8802e',
      opacity: 0.9,
    },
  },
  questionLabel: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    color: '#a3adc2',
    textAlign: 'center',
  },
  questionDescription: {
    color: '#c3cbd9',
    fontSize: '16px',
    lineHeight: 1.6,
    whiteSpace: 'pre-line',
  },
  questionImageFrame: {
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '132px',
    height: '132px',
    padding: '12px',
    boxSizing: 'border-box',
    borderRadius: '12px',
    background: 'rgba(0, 0, 0, 0.35)',
    border: '1px solid rgba(255,255,255,0.12)',
  },
  questionImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  revealIn: {
    from: { opacity: 0, transform: 'translateY(4px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  reveal: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    padding: '14px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    animation: '$revealIn 0.2s ease',
  },
  revealImageFrame: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    padding: '6px',
    boxSizing: 'border-box',
    borderRadius: '10px',
    background: 'rgba(0, 0, 0, 0.35)',
    border: '1px solid rgba(255,255,255,0.12)',
  },
  revealImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  revealInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '5px',
    minWidth: 0,
  },
  revealVerdict: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
  },
  revealNameRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
  },
  revealName: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#ffffff',
  },
  revealPill: {
    fontSize: '10px',
    fontWeight: '600',
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    borderRadius: '999px',
    padding: '2px 8px',
    width: 'fit-content',
  },
  revealUnlock: {
    fontSize: '12px',
    color: '#a8b2c5',
  },
  revealUnlockLabel: {
    fontWeight: '700',
    color: '#e2a94f',
  },
  revealDescription: {
    color: '#c3cbd9',
    fontSize: '13px',
    lineHeight: 1.5,
    whiteSpace: 'pre-line',
    width: '100%',
  },
  continueRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  continueHint: {
    fontSize: '12px',
    color: '#a3adc2',
  },
  keyHintRow: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: '11.5px',
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
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '64px 16px',
    color: '#a3adc2',
    textAlign: 'center',
    fontSize: '14px',
    border: '1px dashed rgba(255,255,255,0.15)',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
  },
  emptyStateTitle: {
    fontWeight: '700',
    fontSize: '17px',
    color: '#c9d1e0',
  },
})

const RiskOfRain2FlashCards = observer(() => {
  const componentStyles = useComponentStyles()
  const uiState = riskOfRainUiState
  const items = uiState.filteredList as FlashcardItem[]
  const poolSize = items.length
  const poolIsFiltered = uiState.filteredList.length !== uiState.list.length
  const canPlay = poolSize >= 2

  const [phase, setPhase] = useState<Phase>('setup')
  const [mode, setMode] = useState<FlashcardMode>(() => loadMode())
  const [optionCount, setOptionCount] = useState<number>(() => loadOptionCount())
  const [questions, setQuestions] = useState<FlashcardQuestion[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedItem, setSelectedItem] = useState<FlashcardItem | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [missed, setMissed] = useState<MissedItem[]>([])
  const [stats, setStats] = useState<FlashcardStats>(() => loadStats())
  const [newRecords, setNewRecords] = useState({ streak: false, accuracy: false })

  const question = questions[questionIndex]

  const startSession = (pool: FlashcardItem[], lengthOverride?: number) => {
    if (pool.length < 2) return
    const length = Math.min(lengthOverride ?? SESSION_LENGTH, pool.length)
    setQuestions(buildQuestions(pool, length, Math.min(optionCount, pool.length)))
    setQuestionIndex(0)
    setSelectedItem(null)
    setCorrectCount(0)
    setAnsweredCount(0)
    setStreak(0)
    setBestStreak(0)
    setMissed([])
    setNewRecords({ streak: false, accuracy: false })
    setPhase('question')
  }

  const handleStartSession = () => startSession(items)

  const handlePracticeMissed = () =>
    startSession(missed.map((entry) => entry.item), missed.length)

  const handleOptionCountChange = (count: number) => {
    setOptionCount(count)
    saveOptionCount(count)
  }

  const handleModeChange = (nextMode: FlashcardMode) => {
    setMode(nextMode)
    saveMode(nextMode)
  }

  const handlePick = (picked: FlashcardItem) => {
    if (phase !== 'question' || !question) return
    const isCorrect = picked.nickname === question.item.nickname
    const nextStreak = isCorrect ? streak + 1 : 0
    setSelectedItem(picked)
    setAnsweredCount((count) => count + 1)
    setStreak(nextStreak)
    setBestStreak((current) => Math.max(current, nextStreak))
    if (!isCorrect) setMissed((current) => [...current, { item: question.item, picked }])
    setPhase('feedback')
  }

  const finishSession = () => {
    const finalAccuracy = accuracyPercent(correctCount, answeredCount)
    setNewRecords({
      streak: bestStreak > stats.bestStreak,
      accuracy: finalAccuracy > stats.bestAccuracy,
    })
    const nextStats = {
      bestStreak: Math.max(stats.bestStreak, bestStreak),
      bestAccuracy: Math.max(stats.bestAccuracy, finalAccuracy),
    }
    setStats(nextStats)
    saveStats(nextStats)
    setPhase('summary')
  }

  const handleContinue = () => {
    if (phase !== 'feedback') return
    if (questionIndex + 1 >= questions.length) {
      finishSession()
      return
    }
    setQuestionIndex((index) => index + 1)
    setSelectedItem(null)
    setPhase('question')
  }

  const handleEndSession = () => setPhase('setup')

  const keydownRef = useRef<(event: KeyboardEvent) => void>(() => {})

  useEffect(() => {
    keydownRef.current = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return
      }

      if (phase === 'question' && question) {
        const optionIndex = Number(event.key) - 1
        if (
          Number.isInteger(optionIndex) &&
          optionIndex >= 0 &&
          optionIndex < question.options.length
        ) {
          event.preventDefault()
          handlePick(question.options[optionIndex])
        }
        return
      }

      if (phase === 'feedback' && (event.key === 'Enter' || event.key === ' ')) {
        if (target && target.tagName === 'BUTTON') return
        event.preventDefault()
        handleContinue()
        return
      }

      if (phase === 'setup' && event.key === 'Enter') {
        if (target && target.tagName === 'BUTTON') return
        event.preventDefault()
        startSession(items)
      }
    }
  })

  useEffect(() => {
    const listener = (event: KeyboardEvent) => keydownRef.current(event)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  const renderRarityPill = (rarity: number) => {
    const { rarityString, rarityColor } = rarityConverter(rarity)
    return (
      <span className={componentStyles.revealPill} style={rarityPillStyle(rarityColor)}>
        {rarityString}
      </span>
    )
  }

  if (!canPlay) {
    return (
      <div className={componentStyles.flashcardsRoot}>
        <div className={componentStyles.emptyState}>
          <div className={componentStyles.emptyStateTitle}>Not enough items to play</div>
          <div>Adjust your search or rarity filters to include at least 2 items.</div>
        </div>
      </div>
    )
  }

  const isCorrectPick =
    selectedItem !== null &&
    question !== undefined &&
    selectedItem.nickname === question.item.nickname

  return (
    <div className={componentStyles.flashcardsRoot}>
      {phase === 'setup' &&
        <RiskOfRainFlashCardStart
          mode={mode}
          onChangeMode={handleModeChange}
          optionCount={optionCount}
          onChangeOptionCount={handleOptionCountChange}
          sessionLength={Math.min(SESSION_LENGTH, poolSize)}
          poolSize={poolSize}
          poolIsFiltered={poolIsFiltered}
          stats={stats}
          onStart={handleStartSession}
        />
      }

      {(phase === 'question' || phase === 'feedback') && question &&
        <div className={componentStyles.gameColumn}>
          <RiskOfRainFlashCardHud
            questionNumber={questionIndex + 1}
            totalQuestions={questions.length}
            correct={correctCount}
            answered={answeredCount}
            streak={streak}
            bestStreak={bestStreak}
            onEndSession={handleEndSession}
          />

          <div
            className={clsx(componentStyles.panel, componentStyles.questionCard)}
            key={`question-${questionIndex}`}
            data-testid="flashcard-question"
          >
            <div className={componentStyles.questionLabel}>
              {mode === 'description' ? 'Which item is this?' : 'What does this item do?'}
            </div>

            {mode === 'description' ? (
              // Description → Item: only the parsed description is shown.
              // Rendering the item's image or name here would give the answer away.
              <div
                className={componentStyles.questionDescription}
                dangerouslySetInnerHTML={{ __html: descriptionParser(question.item.description) }}
              />
            ) : (
              // Image → Description: only the item icon is shown. The alt text
              // must stay empty so the item name never leaks into the question.
              <div className={componentStyles.questionImageFrame}>
                <img
                  className={componentStyles.questionImage}
                  src={require(`./ror2_items_img/${question.item.nickname}.webp`)}
                  alt=""
                  draggable={false}
                  data-testid="flashcard-question-image"
                />
              </div>
            )}

            {phase === 'feedback' &&
              <div className={componentStyles.reveal} data-testid="flashcard-reveal">
                <div className={componentStyles.revealImageFrame}>
                  <img
                    className={componentStyles.revealImage}
                    src={require(`./ror2_items_img/${question.item.nickname}.webp`)}
                    alt={question.item.displayName}
                  />
                </div>
                <div className={componentStyles.revealInfo}>
                  <div
                    className={componentStyles.revealVerdict}
                    style={{ color: isCorrectPick ? CORRECT_COLOR : WRONG_COLOR }}
                  >
                    {isCorrectPick ? 'Correct' : 'Wrong'}
                  </div>
                  <div className={componentStyles.revealNameRow}>
                    <span className={componentStyles.revealName}>{question.item.displayName}</span>
                    {renderRarityPill(question.item.rarity)}
                  </div>
                  {question.item.unlockTask &&
                    <div className={componentStyles.revealUnlock}>
                      <span className={componentStyles.revealUnlockLabel}>Unlock:</span> {question.item.unlockTask}
                    </div>
                  }
                  {mode === 'image' &&
                    <div
                      className={componentStyles.revealDescription}
                      dangerouslySetInnerHTML={{ __html: descriptionParser(question.item.description) }}
                    />
                  }
                </div>
              </div>
            }
          </div>

          <RiskOfRainFlashCardOptions
            key={`options-${questionIndex}`}
            mode={mode}
            options={question.options}
            correctItem={question.item}
            selectedItem={selectedItem}
            answered={phase === 'feedback'}
            onPick={handlePick}
          />

          {phase === 'question' &&
            <div className={componentStyles.keyHintRow}>
              Answer with keys 1-{question.options.length} or click an option
            </div>
          }

          {phase === 'feedback' &&
            <div className={componentStyles.continueRow}>
              <span className={componentStyles.continueHint}>
                Press <kbd className={componentStyles.kbd}>Enter</kbd> to continue
              </span>
              <Button onClick={handleContinue} toggleActive={true}>Continue</Button>
            </div>
          }
        </div>
      }

      {phase === 'summary' &&
        <div className={componentStyles.gameColumn}>
          <RiskOfRainFlashCardSummary
            correct={correctCount}
            total={answeredCount}
            bestStreak={bestStreak}
            missed={missed}
            stats={stats}
            newRecords={newRecords}
            onPracticeMissed={handlePracticeMissed}
            onNewSession={handleStartSession}
          />
        </div>
      }
    </div>
  )
})

export default RiskOfRain2FlashCards
