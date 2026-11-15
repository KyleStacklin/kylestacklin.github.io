import React from "react"
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { rarityConverter, rarityPillStyle, rarityTextToNum } from "./RiskOfRainBusinessLogic";
import riskOfRainUiState from "./RiskOfRainUiState";
import { useStyles } from "./useStyles";
import { observer } from "mobx-react-lite";
import RiskOfRain2HeaderHamburger from "./RiskOfRain2HeaderHamburger";
import SearchBar from "./common/SearchBar";
import { DLC_CODES, DLC_NAMES, dlcsAreDefault, filtersAreDefault, RARITY_NAMES, DisplayType, DlcCode } from "./RiskOfRain2Types";
import { DISPLAY_TYPE_PATHS } from "./routing";

const RiskOfRain2Header = observer(() => {
  const styles = useStyles();
  const navigate = useNavigate()
  const uiState = riskOfRainUiState
  const showGrid = uiState.displayType === 'grid'
  const showList = uiState.displayType === 'list'
  const showFlashCards = uiState.displayType === 'flashCards'

  const changeDisplayType = (display: DisplayType) => {
    navigate(DISPLAY_TYPE_PATHS[display])
  }

  const handleHamburgerClick = () => {
    uiState.toggleHeaderExpanded()
  }

  const handleFilter = (filter?: string) => {
    if (!filter) return

    if (uiState.filters.has(filter)) {
      uiState.removeFilter(filter)
    } else {
      uiState.addFilter(filter)
    }
  }

  const rarities = RARITY_NAMES

  const filterPillStyle = (rarity: string) => {
    const { rarityColor } = rarityConverter(rarityTextToNum(rarity))
    return rarityPillStyle(rarityColor, uiState.filters.has(rarity))
  }

  const showResetFilters = !filtersAreDefault(uiState.filters)
  const showResetDlcs = !dlcsAreDefault(uiState.enabledDlcs)

  const headerClasses = clsx(styles.header, styles.fillAvailableWidth)
  const filterOptionsClasses = clsx(
    styles.flexRow,
    styles.filterOptions
  )
  const rarityFilterClasses = clsx(
    styles.flexRow,
    styles.rarityFilter
  )
  const dlcFilterClasses = clsx(
    styles.flexRow,
    styles.dlcFilter
  )

  const expanded = uiState.headerExpanded

  return (
    <div className={headerClasses}>
      <div className={styles.headerTitleRow}>
        <div className={styles.headerTitle}>Risk of Rain 2 Database</div>
        <div className={styles.resultCount}>{uiState.filteredList.length} items</div>
        <SearchBar />
        <RiskOfRain2HeaderHamburger expanded={expanded} onClick={handleHamburgerClick} />
      </div>

      <div
        className={styles.headerControls}
        style={{ maxHeight: expanded ? 320 : 0, opacity: expanded ? 1 : 0 }}
      >
        <div className={styles.headerControlsRow}>
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
                return (
                  <Button
                    key={i}
                    onClick={handleFilter}
                    style={filterPillStyle(rarity)}
                    toggle={true}
                    toggleActive={active}
                  >
                      {rarity}
                  </Button>
                )
              })
            }
            {showResetFilters &&
              <button
                type="button"
                className={styles.resetFilterLink}
                onClick={() => uiState.resetFilters()}
              >
                Reset
              </button>
            }
          </div>
        </div>

        <div className={dlcFilterClasses}>
          <span className={styles.dlcLabel}>DLC:</span>
          {DLC_CODES.map((code) => {
            const enabled = uiState.enabledDlcs.has(code)
            const dlcName = DLC_NAMES[code as DlcCode]
            const toggleClasses = clsx(
              styles.dlcToggle,
              enabled ? styles.dlcToggleActive : styles.dlcToggleInactive,
              code === 'base' && styles.dlcToggleText
            )
            return (
              <button
                key={code}
                type="button"
                className={toggleClasses}
                onClick={() => uiState.toggleDlc(code)}
                aria-pressed={enabled}
                aria-label={dlcName}
                title={dlcName}
              >
                {code === 'base'
                  ? 'Base'
                  : <img className={styles.dlcToggleImage} src={require(`./dlc_logos/${code}.webp`)} alt="" draggable={false} />}
              </button>
            )
          })}
          {showResetDlcs &&
            <button
              type="button"
              className={styles.resetFilterLink}
              aria-label="Reset DLC"
              title="Restore all DLCs"
              onClick={() => uiState.resetDlcs()}
            >
              Reset
            </button>
          }
        </div>
      </div>
    </div>
  )
});

export default RiskOfRain2Header;
