import React, { useEffect, useState } from "react"
import { useStyles } from "./useStyles";
import RiskOfRain2ItemTile from "./RiskOfRain2ItemTile";
import SearchBar from "./common/SearchBar";
import { createUseStyles } from "react-jss";
import clsx from "clsx";

const useComponentStyles = createUseStyles({
  gridListContainer: {
    padding: '0px 16px 0px 16px'
  },
  searchBarContainer: {
    marginBottom: 16
  }
})

type Props = {
  children: React.ReactNode
}

const GridListContainer = ({ children }: Props) => {
  const styles = useStyles()
  const componentStyles = useComponentStyles()

  const containerClasses = clsx(
    styles.flexColumn,
    componentStyles.gridListContainer
  )

  return (
    <div className={containerClasses}>
      <div className={componentStyles.searchBarContainer}>
        <SearchBar />
      </div>
      { children }
    </div>
  )
};

export default GridListContainer;
