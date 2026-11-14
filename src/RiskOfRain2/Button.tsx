import React from "react"
import clsx from "clsx";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  button: {
    height: '34px',
    padding: '6px 14px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: '#c9d1e0',
    border: '1px solid rgba(255,255,255,0.12)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '0.2px',
    transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.12)',
      color: '#ffffff',
      borderColor: 'rgba(255,255,255,0.22)',
    },
  },
  buttonActive: {
    backgroundColor: '#e8802e',
    border: '1px solid #ff9d4d',
    color: '#221507',

    '&:hover': {
      backgroundColor: '#f18c3c',
      borderColor: '#ff9d4d',
      color: '#221507',
    },
  },
  disabled: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#5b6272',
    cursor: 'not-allowed',
  },
})

type Props = {
  children: string | JSX.Element
  className?: string
  disabled?: boolean
  onClick: (children?: any) => void
  onClickPassBack?: any
  style?: React.CSSProperties
  toggle?: boolean
  toggleActive?: boolean
}

const Button = (props: Props) => {
  const {
    children,
    className,
    disabled,
    onClick,
    onClickPassBack,
    style,
    toggle,
    toggleActive
  } = props;
  const styles = useStyles()

  const handleClick = () => {
    if (disabled) return

    if (onClick) {
      if (onClickPassBack) {
        onClick(onClickPassBack)
        return
      }

      if (typeof children === 'string') onClick(children)
    }
  }

  const buttonClasses = clsx(
    className,
    styles.button,
    { [styles.buttonActive]: toggleActive }
  )
  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      style={style}
    >
      {children}
    </button>
  )
}

export default Button
