import React from "react"
import { useStyles } from "../useStyles";
import clsx from "clsx";
import riskOfRainUiState from "../RiskOfRainUiState";

type Props = {

};

const SearchBar = (props: Props) => {
  const styles = useStyles()

  const uiState = riskOfRainUiState
  const items = uiState.list

  const searchBarContainerClasses = clsx(
    styles.flexRow,
    styles.flexLeft,
  )

  return (
    <div className={searchBarContainerClasses}>
      <input
        className={styles.searchBar}
        type="text"
        placeholder="Search..."
        onChange={(e) => {
          const filteredItems = items.filter((item) => {
            return item.displayName.toLowerCase().includes(e.target.value.toLowerCase()) ||
              item.nickname.toLowerCase().includes(e.target.value.toLowerCase()) ||
              item.description.toLowerCase().includes(e.target.value.toLowerCase())
        })
        uiState.filteredList = filteredItems
      }} />
    </div>
  )
};

export default SearchBar;
