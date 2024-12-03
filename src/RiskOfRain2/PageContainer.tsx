import React, { useEffect, useState } from "react"
import { useStyles } from "./useStyles";
import RiskOfRain2ItemTile from "./RiskOfRain2ItemTile";
import SearchBar from "./common/SearchBar";
import { createUseStyles } from "react-jss";
import clsx from "clsx";

const useComponentStyles = createUseStyles({
  pageContainer: {
    padding: '0px 16px 0px 16px',
    marginTop: 72,
  },
  searchBarContainer: {
    marginBottom: 16
  }
})

type Props = {
  children: React.ReactNode
  search?: boolean
}

const PageContainer = ({ children, search }: Props) => {
  const styles = useStyles()
  const componentStyles = useComponentStyles()

  const containerClasses = clsx(
    styles.flexColumn,
    styles.fillAvailableHeight,
    componentStyles.pageContainer
  )

  return (
    <div className={containerClasses}>
      { search && (
        <div className={componentStyles.searchBarContainer}>
          <SearchBar />
        </div>
      )}
      { children }
    </div>
  )
};

export default PageContainer;
