import React, { useState } from "react"
import clsx from "clsx";
import { createUseStyles } from "react-jss";
import { rarityConverter } from "./RiskOfRainBusinessLogic";
import RiskOfRain2ItemTileDescription from "./RiskOfRain2ItemTileDescription";

const useStyles = createUseStyles({
  tile: {
    fontFamily: 'Helvetica Neue',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '8px',
    // border: '1px solid black',
    borderRadius: '4px',
    width: '300px',
    height: '235px',

    overflow: 'auto',
  },
  itemNumber: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  bold: {
    fontWeight: '700',
    fontSize: '22px',
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
    textAlign: 'left',
    color: '#ffffff',
  },
  howToUnlock: {
    cursor: 'pointer',
    color: 'blue',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexLeftJustify: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  flexSpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  },
})

type Props = {
  item: any
};

const RiskOfRain2ItemTile = ({ item }: Props) => {
  const { displayName, nickname, rarity, description, itemNumber, unlockTask } = item
  const styles = useStyles()

  const [showUnlockTask, setShowUnlockTask] = useState(false)

  const handleHowToUnlock = () => setShowUnlockTask(!showUnlockTask)

  const { background, rarityString, rarityColor } = rarityConverter(rarity)
  const hasItemNumber = itemNumber !== -1
  const displayNameClasses = clsx(
    styles.displayName,
    {[styles.flexLeftJustify]: !hasItemNumber},
    {[styles.flexSpaceBetween]: hasItemNumber}
  )

  return (
    <div
      className={styles.tile}
      style={{ border: `solid 4px ${rarityColor}`, background }}
    >

      <div className={styles.itemNumber}></div>
      <div className={displayNameClasses}>
        <div className={styles.bold}>{displayName}</div>
        {hasItemNumber && <div>{itemNumber}</div>}
      </div>

      <div className={styles.flexLeftJustify}>
        <div>
          <img src={require(`./ror2_items_img/${nickname}.webp`)} />
        </div>
        <div className={styles.flexColumn}>
          <ul className={styles.attributes}>
            <li>Alias: {nickname}</li>
            <li>Rarity: {rarityString}</li>

            { unlockTask &&
              <li className={styles.howToUnlock} onClick={handleHowToUnlock}>
                {showUnlockTask ? 'Hide' : 'Show'} unlock task
              </li>
            }
            { showUnlockTask && <div>{unlockTask}</div> }
          </ul>
        </div>
      </div>

      {/* <div className={styles.flexLeftJustify}>{description}</div> */}
      <RiskOfRain2ItemTileDescription description={description} />

    </div>
  )
};

export default RiskOfRain2ItemTile;
