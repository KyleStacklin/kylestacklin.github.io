import React, { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import RiskOfRain2ItemTile from "./RiskOfRain2ItemTile";
import riskOfRainUiState from "./RiskOfRainUiState";
import { observer } from "mobx-react-lite";
import RiskOfRainListItem from "./RiskOfRainListItem";
import { useStyles } from "./useStyles";
import RiskOfRain2Header from "./RiskOfRain2Header";
import RiskOfRain2FlashCards from "./RiskOfRain2FlashCards";
import PageContainer from "./PageContainer";
import { pathToDisplayType } from "./routing";
import { saveLastRoute } from "./localStorage";



const RiskOfRain2 = observer(() => {
  const styles = useStyles();
  const uiState = riskOfRainUiState
  const filteredList = uiState.filteredList
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const displayType = pathToDisplayType(location.pathname)
    if (!displayType) {
      navigate('/', { replace: true })
      return
    }
    saveLastRoute(location.pathname)
    if (uiState.displayType !== displayType) {
      uiState.setDisplayType(displayType)
    }
  }, [location.pathname, navigate, uiState])

  const showGrid = uiState.displayType === 'grid'
  const showList = uiState.displayType === 'list'
  const showFlashCards = uiState.displayType === 'flashCards'

  return (
    <div className={styles.ror2Container}>

      <RiskOfRain2Header />

      <div className={styles.scrollArea}>
        { (showGrid || showList) &&
          <PageContainer>
            { showGrid &&
              <div className={styles.grid}>
                { filteredList.map((item, i) => <RiskOfRain2ItemTile key={i} item={item} />) }
              </div>
            }

            { showList &&
              <div className={styles.list}>
                { filteredList.map((item, i) => <RiskOfRainListItem key={i} item={item} />) }
              </div>
            }

            { filteredList.length === 0 &&
              <div className={styles.emptyState}>
                <div className={styles.emptyStateTitle}>No items found</div>
                <div>Try a different search or adjust your rarity filters.</div>
              </div>
            }
          </PageContainer>
        }

        { showFlashCards &&
          <PageContainer>
            <RiskOfRain2FlashCards />
          </PageContainer>
        }
      </div>

    </div>
  )
})

export default RiskOfRain2;
