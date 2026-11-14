import React from "react"
import { useStyles } from "./useStyles";
import { createUseStyles } from "react-jss";
import clsx from "clsx";

const useComponentStyles = createUseStyles({
  pageContainer: {
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px 16px 40px',
    boxSizing: 'border-box',
  },
})

type Props = {
  children: React.ReactNode
}

const PageContainer = ({ children }: Props) => {
  const styles = useStyles()
  const componentStyles = useComponentStyles()

  const containerClasses = clsx(
    styles.flexColumn,
    componentStyles.pageContainer
  )

  return (
    <div className={containerClasses}>
      { children }
    </div>
  )
};

export default PageContainer;
