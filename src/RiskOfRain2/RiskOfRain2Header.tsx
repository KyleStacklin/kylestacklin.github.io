import React, { useCallback, useEffect, useRef, useState } from "react"
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
import { DlcTooltip } from "./DlcTooltip";
import { DISPLAY_TYPE_PATHS } from "./routing";

type FadeSide = 'none' | 'right' | 'left' | 'both'

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

  const dlcRowRef = useRef<HTMLDivElement | null>(null)
  const rarityRowRef = useRef<HTMLDivElement | null>(null)
  const [rowFades, setRowFades] = useState<{ dlc: FadeSide; rarity: FadeSide }>({ dlc: 'none', rarity: 'none' })

  const computeRowFades = useCallback(() => {
    const measure = (el: HTMLDivElement | null): FadeSide => {
      if (!el) return 'none'
      const max = el.scrollWidth - el.clientWidth
      if (max <= 4) return 'none'
      if (el.scrollLeft <= 4) return 'right'
      if (el.scrollLeft >= max - 4) return 'left'
      return 'both'
    }
    setRowFades({ dlc: measure(dlcRowRef.current), rarity: measure(rarityRowRef.current) })
  }, [])

  useEffect(() => {
    computeRowFades()
    window.addEventListener('resize', computeRowFades)
    return () => window.removeEventListener('resize', computeRowFades)
  }, [computeRowFades])

  const scrollRowByPage = (ref: React.RefObject<HTMLDivElement | null>, direction: 1 | -1) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: 'smooth' })
  }

  const fadeClass = (side: FadeSide) =>
    side === 'right'
      ? styles.fadeRight
      : side === 'left'
        ? styles.fadeLeft
        : side === 'both'
          ? styles.fadeBoth
          : undefined

  const headerClasses = clsx(styles.header, styles.fillAvailableWidth)
  const filterOptionsClasses = clsx(
    styles.flexRow,
    styles.filterOptions
  )
  const dlcGroupClasses = clsx(
    styles.filterGroup,
    styles.dlcGroup
  )
  const rarityGroupClasses = clsx(
    styles.filterGroup,
    styles.rarityGroup
  )
  const dlcItemsClasses = clsx(
    styles.groupItemsRow,
    styles.groupItemsRowEnd,
    fadeClass(rowFades.dlc)
  )
  const rarityItemsClasses = clsx(
    styles.groupItemsRow,
    styles.groupItemsRowEnd,
    fadeClass(rowFades.rarity)
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
        style={{ maxHeight: expanded ? 400 : 0, opacity: expanded ? 1 : 0 }}
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

          <div className={styles.filterGroups}>
            <div className={dlcGroupClasses}>
              <div className={styles.groupHeader}>
                <span className={styles.groupLabel}>DLC</span>
                {showResetDlcs &&
                  <button
                    type="button"
                    className={styles.groupReset}
                    aria-label="Reset DLC"
                    title="Restore all DLCs"
                    onClick={() => uiState.resetDlcs()}
                  >
                    Reset
                  </button>
                }
              </div>
              <div className={styles.groupScroller}>
                <div ref={dlcRowRef} onScroll={computeRowFades} className={dlcItemsClasses}>
                  {DLC_CODES.map((code) => {
                    const enabled = uiState.enabledDlcs.has(code)
                    const dlcName = DLC_NAMES[code as DlcCode]
                    const toggleClasses = clsx(
                      styles.dlcToggle,
                      enabled ? styles.dlcToggleActive : styles.dlcToggleInactive,
                      code === 'base' && styles.dlcToggleText
                    )
                    return (
                      <DlcTooltip key={code} label={dlcName} placement="bottom">
                        <button
                          type="button"
                          className={toggleClasses}
                          onClick={() => uiState.toggleDlc(code)}
                          aria-pressed={enabled}
                          aria-label={dlcName}
                        >
                          {code === 'base'
                            ? 'Base'
                            : <img className={styles.dlcToggleImage} src={require(`./dlc_logos/${code}.webp`)} alt="" draggable={false} />}
                        </button>
                      </DlcTooltip>
                    )
                  })}
                </div>
                {(rowFades.dlc === 'left' || rowFades.dlc === 'both') &&
                  <button
                    type="button"
                    className={clsx(styles.scrollChevron, styles.scrollChevronLeft)}
                    aria-label="Scroll DLC filters left"
                    onClick={() => scrollRowByPage(dlcRowRef, -1)}
                  >
                    ‹
                  </button>}
                {(rowFades.dlc === 'right' || rowFades.dlc === 'both') &&
                  <button
                    type="button"
                    className={clsx(styles.scrollChevron, styles.scrollChevronRight)}
                    aria-label="Scroll DLC filters right"
                    onClick={() => scrollRowByPage(dlcRowRef, 1)}
                  >
                    ›
                  </button>}
              </div>
            </div>

            <div className={styles.groupDivider} aria-hidden="true" />

            <div className={rarityGroupClasses}>
              <div className={styles.groupHeader}>
                <span className={styles.groupLabel}>Class</span>
                {showResetFilters &&
                  <button
                    type="button"
                    className={styles.groupReset}
                    onClick={() => uiState.resetFilters()}
                  >
                    Reset
                  </button>
                }
              </div>
              <div className={styles.groupScroller}>
                <div ref={rarityRowRef} onScroll={computeRowFades} className={rarityItemsClasses}>
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
                </div>
                {(rowFades.rarity === 'left' || rowFades.rarity === 'both') &&
                  <button
                    type="button"
                    className={clsx(styles.scrollChevron, styles.scrollChevronLeft)}
                    aria-label="Scroll Class filters left"
                    onClick={() => scrollRowByPage(rarityRowRef, -1)}
                  >
                    ‹
                  </button>}
                {(rowFades.rarity === 'right' || rowFades.rarity === 'both') &&
                  <button
                    type="button"
                    className={clsx(styles.scrollChevron, styles.scrollChevronRight)}
                    aria-label="Scroll Class filters right"
                    onClick={() => scrollRowByPage(rarityRowRef, 1)}
                  >
                    ›
                  </button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
});

export default RiskOfRain2Header;
