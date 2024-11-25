import React from "react"
import clsx from "clsx";
import Button from "./Button";
import { rarityConverter, rarityTextToNum } from "./RiskOfRainBusinessLogic";
import riskOfRainUiState from "./RiskOfRainUiState";
import { useStyles } from "./useStyles";

type Props = {

};

const RiskOfRain2Header = (props: Props) => {
  const styles = useStyles();
  const uiState = riskOfRainUiState
  const items = uiState.list
  const showGrid = uiState.displayType === 'grid'
  const showList = uiState.displayType === 'list'
  const showTierList = uiState.displayType === 'tierList'
  const showFlashCards = uiState.displayType === 'flashCards'

  const changeDisplayType = (display: string) => {
    uiState.setDisplayType(display)
  }

  const handleFilter = (filter?: string) => {
    if (filter) {

      if (uiState.filters.has(filter)) {
        uiState.removeFilter(filter)
      } else {
        uiState.addFilter(filter)
      }

      let filteredList = items
      if (uiState.filters.size > 0) {
        filteredList = items.filter((item) => {
          const {rarityString} = rarityConverter(item.rarity)
          return uiState.filters.has(rarityString)
        })
      }

      uiState.filteredList = filteredList
    }
  }

  const headerClasses = clsx(
    styles.flexColumn,
    styles.header
  )
  const filterOptionsClasses = clsx(
    styles.flexRow,
    styles.filterOptions
  )
  const searchBarContainerClasses = clsx(
    styles.flexRow,
    styles.flexLeft,
  )

  const rarities = ['Common', 'Uncommon', 'Legendary', 'Boss', 'Void', 'Lunar', 'Equipment']

  return (
    <div className={headerClasses}>
      <div className={styles.flexRow}>Risk of Rain 2 Database</div>

      <div className={filterOptionsClasses}>
        <Button
          onClick={() => changeDisplayType('grid')}
          toggle={true}
          toggleActive={showGrid}
        >
          Grid
        </Button>
        <Button
          onClick={() => changeDisplayType('list')}
          toggle={true}
          toggleActive={showList}
        >
          List
        </Button>
        <Button
          onClick={() => changeDisplayType('flashCards')}
          toggle={true}
          toggleActive={showFlashCards}
        >
          Flash Cards
        </Button>
      </div>

      <div className={filterOptionsClasses} style={{overflow: 'auto'}}>

        {
          rarities.map((rarity, i) => {
            const active = uiState.filters.has(rarity)
            const { background: bgColor, rarityColor } = rarityConverter(rarityTextToNum(rarity))
            const background = (bgColor && active) ?
              { background: bgColor, border: `1px solid ${rarityColor}` } :
              { border: `1px solid ${rarityColor}`, color: rarityColor }
            return (
              <Button
                key={i}
                onClick={handleFilter}
                style={background}
                toggle={true}
                toggleActive={active}
              >
                  {rarity}
              </Button>
            )
          })
        }
      </div>

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
    </div>
  )
};

export default RiskOfRain2Header;
