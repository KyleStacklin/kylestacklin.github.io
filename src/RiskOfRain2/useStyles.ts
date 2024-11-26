import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
  ror2Container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
    height: '100%',
    backgroundColor: '#a1a1a1',
    overflowY: 'auto',
    overflowX: 'hidden',
    fontFamily: 'Helvetica Neue, Arial, sans-serif',
    paddingBottom: '16px',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexLeft: {
    display: 'flex',
    justifyContent: 'start',
  },
  flexCenterY: {
    display: 'flex',
    justifyContent: 'center',
  },
  flexCenterX: {
    display: 'flex',
    alignItems: 'center',
  },
  flexSpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  padding16X: { paddingLeft: '16px', paddingRight: '16px' },
  padding16Y: { paddingTop: '16px', paddingBottom: '16px' },
  gap4: { gap: '4px' },
  gap8: { gap: '8px' },
  gap16: { gap: '16px' },
  fillAvailableWidth: {
    '@supports (width: -webkit-fill-available)': {
      width: '-webkit-fill-available',
    },
    '@supports not (width: -webkit-fill-available)': {
      '@supports (width: -moz-available)': {
        width: '-moz-available',
      },
      '@supports not (width: -moz-available)': {
        width: 'fill-available',
      },
    },
  },


  // Header
  header: {
    position: 'absolute',
    top: 0,
    zIndex: 2,
    gap: '16px',
    backgroundColor: '#0d5175',
    color: '#ffffff',
    padding: '16px',
    transition: 'height 0.5s ease',
  },
  headerTitle: { fontWeight: '700', textDecoration: 'underline' },
  searchBar: {
    width: '100%',
    height: '32px',
    padding: '4px 8px',
    border: '1px solid #adadad',
    borderRadius: '4px',
    outline: 'none',
    fontSize: '16px',
  },
  filterOptions: {
    gap: '16px',
    overflowX: 'auto',
    overflowY: 'hidden',
  },
  rarityFilter: {
    display: 'flex',
    alignItems: 'start',
    height: '38px',
  },


  // Tier List
  tierListCharacter: {
    cursor: 'pointer',
    width: '79px',
    height: '79px',
  },
  tierListCharacterDLC: {
    width: '70px',
    height: '70px',
    background: '#445262',
    border: '2px solid #adadad',
    borderRadius: '4px',
  },
  tierListCharacterSelected: {
    background: '#5040A5',
  },
  tierList: {
    backgroundColor: '#1A1A18',
    width: '-webkit-fill-available',
  },
  tierListRow: {
    // height: '160px',
  },
  tierListTier: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '48px',
    width: '75px',

    fontWeight: '700',
    fontSize: '24px',
  },
  tierListContents: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '4px',
  },
  tierListItem: {
    height: '60px',
  },




  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    overflow: 'hidden'
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '32px',
  },
})