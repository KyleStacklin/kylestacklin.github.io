import React from "react"
import { createUseStyles } from "react-jss";
import RiskOfRain2ItemTileDescription from "./RiskOfRain2ItemTileDescription";
import { rarityConverter, rarityPillStyle } from "./RiskOfRainBusinessLogic";
import { DLC_NAMES, DlcCode } from "./RiskOfRain2Types";

const useComponentStyles = createUseStyles({
  listItem: {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '14px 16px',
    borderRadius: '12px',
    background: 'linear-gradient(180deg, #242b3a 0%, #1a202c 100%)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
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
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.45)',
    },
  },
  imageFrame: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    padding: '6px',
    boxSizing: 'border-box',
    borderRadius: '10px',
    background: 'rgba(0, 0, 0, 0.35)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: 0,
    flex: 1,
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    // Reserve the top-right corner for the DLC badge so long names never
    // collide with it.
    paddingRight: '26px',
  },
  displayName: {
    margin: 0,
    fontWeight: '700',
    fontSize: '15px',
    color: '#ffffff',
  },
  rarityPill: {
    fontSize: '10px',
    fontWeight: '600',
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    borderRadius: '999px',
    padding: '2px 8px',
    width: 'fit-content',
  },
  description: {
    fontSize: '12.5px',
  },
  unlockTask: {
    fontSize: '12px',
    color: '#a8b2c5',
  },
  unlockLabel: {
    fontWeight: '700',
    color: '#e2a94f',
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

const RiskOfRainListItem = ({ item }: Props) => {
  const { displayName, nickname, rarity, description, unlockTask, dlc } = item
  const componentStyles = useComponentStyles()

  const { rarityString, rarityColor } = rarityConverter(rarity)

  const dlcName = dlc && dlc !== 'base' ? DLC_NAMES[dlc as DlcCode] : null

  return (
    <div className={componentStyles.listItem} style={{ '--tile-accent': rarityColor } as React.CSSProperties}>
      {dlcName &&
        <span className={componentStyles.dlcBadge} aria-hidden={true}>
          <img
            className={componentStyles.dlcBadgeImage}
            src={require(`./dlc_logos/${dlc}.webp`)}
            alt=""
            title={dlcName}
            draggable={false}
          />
        </span>
      }
      <div className={componentStyles.imageFrame}>
        <img className={componentStyles.image} src={require(`./ror2_items_img/${nickname}.webp`)} alt={displayName} />
      </div>
      <div className={componentStyles.content}>
        <div className={componentStyles.nameRow}>
          <h3 className={componentStyles.displayName}>{displayName}</h3>
          <span className={componentStyles.rarityPill} style={rarityPillStyle(rarityColor)}>
            {rarityString}
          </span>
        </div>
        <RiskOfRain2ItemTileDescription className={componentStyles.description} description={description} />
        { unlockTask &&
          <div className={componentStyles.unlockTask}>
            <span className={componentStyles.unlockLabel}>Unlock:</span> {unlockTask}
          </div>
        }
      </div>
    </div>
  )
};

export default RiskOfRainListItem;
