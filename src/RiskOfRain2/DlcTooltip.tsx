import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  tooltip: {
    position: 'fixed',
    zIndex: 1200,
    padding: '6px 10px',
    borderRadius: '8px',
    background: '#0b0e15',
    border: '1px solid rgba(255,255,255,0.22)',
    boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
    color: '#e8eaf0',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.2px',
    lineHeight: 1.3,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    transform: 'translate(-50%, -100%)',
  },
  tooltipBottom: {
    transform: 'translate(-50%, 0)',
  },
})

type Props = {
  label: string
  placement?: 'top' | 'bottom'
  children: React.ReactElement
}

export const DlcTooltip = ({ label, placement = 'top', children }: Props) => {
  const styles = useStyles()
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const anchorRef = useRef<HTMLElement | null>(null)
  const tooltipRef = useRef<HTMLSpanElement | null>(null)

  const show = useCallback(() => {
    const el = anchorRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos(
      placement === 'top'
        ? { top: rect.top - 8, left: rect.left + rect.width / 2 }
        : { top: rect.bottom + 8, left: rect.left + rect.width / 2 }
    )
  }, [placement])

  const hide = useCallback(() => setPos(null), [])

  useLayoutEffect(() => {
    if (!pos || !tooltipRef.current) return
    const rect = tooltipRef.current.getBoundingClientRect()
    const margin = 8
    const half = rect.width / 2
    const clampedLeft = Math.min(
      Math.max(pos.left, half + margin),
      window.innerWidth - half - margin
    )
    const minTop = rect.height + margin
    const clampedTop = placement === 'top' && pos.top < minTop ? rect.height + 8 : pos.top
    if (clampedLeft !== pos.left || clampedTop !== pos.top) {
      setPos({ top: clampedTop, left: clampedLeft })
    }
  }, [pos, placement])

  useEffect(() => {
    if (!pos) return
    window.addEventListener('scroll', hide, true)
    window.addEventListener('resize', hide)
    return () => {
      window.removeEventListener('scroll', hide, true)
      window.removeEventListener('resize', hide)
    }
  }, [pos, hide])

  return (
    <>
      {React.cloneElement(children, {
        ref: anchorRef,
        onMouseEnter: show,
        onMouseLeave: hide,
        onFocus: show,
        onBlur: hide,
      })}
      {pos &&
        createPortal(
          <span
            ref={tooltipRef}
            role="tooltip"
            className={clsx(styles.tooltip, placement === 'bottom' && styles.tooltipBottom)}
            style={{ top: pos.top, left: pos.left }}
          >
            {label}
          </span>,
          document.body
        )}
    </>
  )
}
