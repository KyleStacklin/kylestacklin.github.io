import React from "react"
import { createUseStyles } from "react-jss";
import { rarityConverter, rarityPillStyle } from "./RiskOfRainBusinessLogic";
import RiskOfRain2ItemTileDescription from "./RiskOfRain2ItemTileDescription";
import { DLC_NAMES, DlcCode } from "./RiskOfRain2Types";

const useStyles = createUseStyles({
  tile: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    paddingTop: '18px',
    borderRadius: '12px',
    overflow: 'hidden',
    background: 'linear-gradient(180deg, #242b3a 0%, #1a202c 100%)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.35)',
    transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
    '&:hover': {
      transform: 'translateY(-3px)',
      borderColor: 'var(--tile-accent)',
      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.5)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: 'var(--tile-accent)',
      opacity: 0.9,
    },
  },
  tileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  imageFrame: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '72px',
    height: '72px',
    padding: '6px',
    boxSizing: 'border-box',
    borderRadius: '10px',
    background: 'rgba(0, 0, 0, 0.35)',
    border: '1px solid var(--tile-accent)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  tileHeading: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: 0,
    // Reserve the top-right corner for the DLC badge so long names never
    // collide with it.
    paddingRight: '26px',
  },
  displayName: {
    margin: 0,
    fontWeight: '700',
    fontSize: '16px',
    lineHeight: 1.25,
    color: '#ffffff',
  },
  alias: {
    fontSize: '11px',
    color: '#a3adc2',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
  },
  rarityPill: {
    fontSize: '10px',
    fontWeight: '600',
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    borderRadius: '999px',
    padding: '3px 10px',
    width: 'fit-content',
  },
  itemNumber: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#aab4c8',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: '999px',
    padding: '2px 8px',
  },
  description: {
    color: '#c3cbd9',
    fontSize: '13px',
    lineHeight: 1.5,
  },
  unlockTask: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '6px',
    marginTop: 'auto',
    paddingTop: '10px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    fontSize: '12.5px',
    color: '#a8b2c5',
  },
  unlockLabel: {
    fontWeight: '700',
    color: '#e2a94f',
    whiteSpace: 'nowrap',
  },
  dlcBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    width: '22px',
    height: '22px',
    padding: '2px',
    borderRadius: '6px',
    background: 'rgba(8, 10, 16, 0.7)',
    border: '1px solid rgba(255,255,255,0.28)',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.45)',
    overflow: 'hidden',
  },
  dlcBadgeImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: '4px',
    display: 'block',
  },
})

type Props = {
  item: any
};

const RiskOfRain2ItemTile = ({ item }: Props) => {
  const { displayName, nickname, rarity, description, itemNumber, unlockTask, dlc } = item
  const { rarityString, rarityColor } = rarityConverter(rarity)
  const styles = useStyles()

  const hasItemNumber = itemNumber !== -1
  const dlcName = dlc && dlc !== 'base' ? DLC_NAMES[dlc as DlcCode] : null

  return (
    <div
      className={styles.tile}
      style={{ '--tile-accent': rarityColor } as React.CSSProperties}
    >
      {dlcName &&
        <span className={styles.dlcBadge} aria-hidden={true}>
          <img
            className={styles.dlcBadgeImage}
            src={require(`./dlc_logos/${dlc}.webp`)}
            alt=""
            title={dlcName}
            draggable={false}
          />
        </span>
      }
      <div className={styles.tileHeader}>
        <div className={styles.imageFrame}>
          <img className={styles.image} src={require(`./ror2_items_img/${nickname}.webp`)} alt={displayName} />
        </div>
        <div className={styles.tileHeading}>
          <h3 className={styles.displayName}>{displayName}</h3>
          <div className={styles.metaRow}>
            <span className={styles.rarityPill} style={rarityPillStyle(rarityColor)}>
              {rarityString}
            </span>
            {hasItemNumber && <span className={styles.itemNumber}>#{itemNumber}</span>}
          </div>
          <div className={styles.alias}>{nickname}</div>
        </div>
      </div>

      <div className={styles.description}>
        <RiskOfRain2ItemTileDescription description={description} />
      </div>

      { unlockTask &&
        <div className={styles.unlockTask}>
          <span className={styles.unlockLabel}>Unlock:</span>
          <span>{unlockTask}</span>
        </div>
      }
    </div>
  )
};

export default RiskOfRain2ItemTile;
