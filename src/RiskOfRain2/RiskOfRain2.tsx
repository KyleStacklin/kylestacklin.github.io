import React, { useEffect, useState } from "react"
import ror2_items from "./ror2_items.json"
import RiskOfRain2ItemTile from "./RiskOfRain2ItemTile";
import riskOfRainUiState from "./RiskOfRainUiState";
import { observer } from "mobx-react-lite";
import RiskOfRainListItem from "./RiskOfRainListItem";
import { useStyles } from "./useStyles";
import RiskOfRain2Header from "./RiskOfRain2Header";
import RiskOfRain2FlashCards from "./RiskOfRain2FlashCards";
import PageContainer from "./PageContainer";



const RiskOfRain2 = observer(() => {
  const styles = useStyles();
  const uiState = riskOfRainUiState
  const filteredList = uiState.filteredList

  const showGrid = uiState.displayType === 'grid'
  const showList = uiState.displayType === 'list'
  const showTierList = uiState.displayType === 'tierList'
  const showFlashCards = uiState.displayType === 'flashCards'

  // // Sort items by item number
  // items.sort((a, b) => {
  //   if (a.itemNumber === -1) return 1;
  //   if (b.itemNumber === -1) return -1;
  //   return a.itemNumber - b.itemNumber;
  // })


  return (
    <div className={styles.ror2Container}>

      <RiskOfRain2Header />

      { showList &&
        <PageContainer search={true}>
          <div className={styles.list}>
            { filteredList.map((item, i) => <RiskOfRainListItem key={i} item={item} />) }
          </div>
        </PageContainer>
      }

      { showGrid &&
        <PageContainer search={true}>
          <div className={styles.grid}>
            { filteredList.map((item, i) => <RiskOfRain2ItemTile key={i} item={item} />) }
          </div>
        </PageContainer>
      }

      { showFlashCards &&
        <PageContainer>
          <RiskOfRain2FlashCards />
        </PageContainer>
      }


    </div>
  )
})

export default RiskOfRain2;
