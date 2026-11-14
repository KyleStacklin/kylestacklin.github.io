import React from "react"
import { useStyles } from "../useStyles";
import clsx from "clsx";
import riskOfRainUiState from "../RiskOfRainUiState";
import { observer } from "mobx-react-lite";

type Props = {

};

const SearchBar = observer((props: Props) => {
  const styles = useStyles()

  const uiState = riskOfRainUiState

  const searchBarContainerClasses = clsx(
    styles.flexRow,
    styles.flexLeft,
    styles.headerSearch,
  )

  return (
    <div className={searchBarContainerClasses}>
      <input
        className={styles.searchBar}
        type="text"
        placeholder="Search items..."
        value={uiState.searchQuery}
        onChange={(e) => uiState.setSearchQuery(e.target.value)} />
    </div>
  )
});

export default SearchBar;
