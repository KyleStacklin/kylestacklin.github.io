import React from "react"
import { createUseStyles } from "react-jss";
import RiskOfRain2ItemTileDescription from "./RiskOfRain2ItemTileDescription";
import { rarityConverter } from "./RiskOfRainBusinessLogic";
import clsx from "clsx";
import { useStyles } from "./useStyles";

const useComponentStyles = createUseStyles({
  itemNumber: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  bold: {
    fontWeight: '700',
    fontSize: '16px',
    textShadow: `
      -1px -1px 0 #000, /* Top-left shadow */
      1px -1px 0 #000,  /* Top-right shadow */
      -1px 1px 0 #000,  /* Bottom-left shadow */
      1px 1px 0 #000   /* Bottom-right shadow */
    `,
    color: '#fff'
  },
  displayName: {
    display: 'flex',
    paddingBottom: '8px',
    borderBottom: '1px solid black',
    marginBottom: '4px',
  },
  attributes: {
    listStyleType: 'circle',
    margin: 0,
    padding: '8px 0px 8px 24px',
  },
  howToUnlock: {
    cursor: 'pointer',
    color: 'blue',
  },
  flexLeftJustify: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  description: {
    fontSize: '12px',
    overflowY: 'auto',
  },
  listItem: {
    height: 120,
    borderRadius: 4,
    gap: '16px',
    padding: '8px',
  },
  listItemHr: {
    width: '100%',
    border: '1px solid grey',
    margin: '8px 0px',
  },
})

type Props = {
  item: any
};

const RiskOfRainListItem = ({ item }: Props) => {
  const { displayName, nickname, rarity, description, itemNumber, unlockTask } = item
  const styles = useStyles()
  const componentStyles = useComponentStyles()

  const { background } = rarityConverter(rarity)

  const listItemClasses = clsx(componentStyles.flexLeftJustify, componentStyles.listItem)
  const itemDescriptionClasses = clsx(styles.flexColumn, styles.flexCenterY, styles.fillAvailableWidth)

  return (
    <div className={listItemClasses} style={{background}}>
      <div className={styles.flexCenterX} style={{width: 100}}>
        <img src={require(`./ror2_items_img/${nickname}.webp`)} />
      </div>
      <div className={itemDescriptionClasses} style={{height: '100%'}}>
        <div className={componentStyles.bold}>{displayName}</div>
        <hr className={componentStyles.listItemHr} />
        <RiskOfRain2ItemTileDescription className={componentStyles.description} description={description} />
      </div>
    </div>
  )
};

export default RiskOfRainListItem;
