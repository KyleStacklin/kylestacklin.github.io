import React from "react"
import { createUseStyles } from "react-jss";
import RiskOfRain2ItemTileDescription from "./RiskOfRain2ItemTileDescription";
import { rarityConverter } from "./RiskOfRainBusinessLogic";

const useStyles = createUseStyles({
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
  },
  howToUnlock: {
    cursor: 'pointer',
    color: 'blue',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    width: 100
  },
  flexLeftJustify: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 100,
    borderRadius: 4,
    gap: '16px',
  },
  flexSpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  },
})

type Props = {
  item: any
};

const RiskOfRainListItem = ({ item }: Props) => {
  const { displayName, nickname, rarity, description, itemNumber, unlockTask } = item
  const styles = useStyles();

  const { background } = rarityConverter(rarity)

  return (
    <div className={styles.flexLeftJustify} style={{background}}>
      <div className={styles.flexCenter}>
        <img src={require(`./ror2_items_img/${nickname}.webp`)} />
      </div>
      <div className={styles.bold}>{displayName}</div>
      <RiskOfRain2ItemTileDescription description={description} />
    </div>
  )
};

export default RiskOfRainListItem;
