import React from "react"
import clsx from "clsx";
import Button from "./Button";
import { rarityConverter, rarityTextToNum } from "./RiskOfRainBusinessLogic";
import riskOfRainUiState from "./RiskOfRainUiState";
import { useStyles } from "./useStyles";
import { observer } from "mobx-react-lite";
import RiskOfRain2HeaderHamburger from "./RiskOfRain2HeaderHamburger";

const RiskOfRain2Header = observer(() => {
  const styles = useStyles();
  const uiState = riskOfRainUiState
  const items = uiState.list
  const showGrid = uiState.displayType === 'grid'
  const showList = uiState.displayType === 'list'
  const showFlashCards = uiState.displayType === 'flashCards'

  const changeDisplayType = (display: string) => {
    uiState.setDisplayType(display)
  }

  const handleHamburgerClick = () => {
    uiState.headerExpanded = !uiState.headerExpanded
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
    styles.header,
    styles.fillAvailableWidth
  )
  const filterOptionsClasses = clsx(
    styles.flexRow,
    styles.filterOptions
  )
  const rarityFilterClasses = clsx(
    filterOptionsClasses,
    styles.rarityFilter
  )

  const rarities = ['Common', 'Uncommon', 'Legendary', 'Boss', 'Void', 'Lunar', 'Equipment']

  const headerStyle = uiState.headerExpanded ? { height: '128px' } : { height: '24px' }

  return (
    <div className={headerClasses} style={headerStyle}>
      <div className={styles.flexSpaceBetween}>
        <div className={styles.headerTitle}>Risk of Rain 2 Database</div>
        <RiskOfRain2HeaderHamburger expanded={uiState.headerExpanded} onClick={handleHamburgerClick} />
      </div>

      { uiState.headerExpanded &&

        <>
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

          <div className={rarityFilterClasses}>

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
        </>

      }
    </div>
  )
});

export default RiskOfRain2Header;
