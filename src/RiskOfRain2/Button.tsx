import React from "react"
import clsx from "clsx";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  button: {
    padding: '8px 16px',
    borderRadius: '4px',
    backgroundColor: '#fff',
    color: '#007bff',
    border: '1px solid #007bff',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#e6e6e6',
    },
  },
  buttonActive: {
    backgroundColor: '#007bff',
    border: '1px solid #007bff',
    color: '#fff',

    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
  disabled: {
    backgroundColor: '#ccc',
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
