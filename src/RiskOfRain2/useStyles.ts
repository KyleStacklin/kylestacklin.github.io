import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
  ror2Container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    textAlign: 'left',
    backgroundColor: '#12151d',
    backgroundImage: `
      radial-gradient(1100px 520px at 50% -120px, rgba(90, 62, 160, 0.28), transparent 65%),
      radial-gradient(900px 480px at 100% 0px, rgba(232, 126, 34, 0.10), transparent 60%)
    `,
    color: '#e8eaf0',
    fontFamily: 'Helvetica Neue, Arial, sans-serif',
  },
  scrollArea: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    '&::-webkit-scrollbar': { width: '10px' },
    '&::-webkit-scrollbar-track': { background: 'transparent' },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(255,255,255,0.14)',
      borderRadius: '8px',
    },
    '&::-webkit-scrollbar-thumb:hover': { background: 'rgba(255,255,255,0.24)' },
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
  flexCenterX: {
    display: 'flex',
    justifyContent: 'center',
  },
  flexCenterY: {
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
  fillAvailableHeight: {
    '@supports (width: -webkit-fill-available)': {
      height: '-webkit-fill-available',
    },
    '@supports not (width: -webkit-fill-available)': {
      '@supports (width: -moz-available)': {
        height: '-moz-available',
      },
      '@supports not (width: -moz-available)': {
        height: 'fill-available',
      },
    },
  },


  // Header
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: 'rgba(15, 19, 28, 0.88)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.35)',
  },
  headerTitleRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    '@media (max-width: 639px)': {
      gap: '8px',
      '& svg': { marginLeft: 'auto' },
    },
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: '17px',
    letterSpacing: '0.3px',
    color: '#ffffff',
    whiteSpace: 'nowrap',
    '@media (max-width: 639px)': {
      fontSize: '15px',
    },
  },
  resultCount: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#a3adc2',
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '3px 10px',
    borderRadius: '999px',
    whiteSpace: 'nowrap',
    '@media (max-width: 639px)': {
      fontSize: '11px',
      padding: '2px 8px',
    },
  },
  headerSearch: {
    flex: '1 1 180px',
    maxWidth: '440px',
    marginLeft: 'auto',
    '@media (max-width: 639px)': {
      order: 3,
      flex: '1 1 100%',
      maxWidth: 'none',
      marginLeft: 0,
    },
  },
  headerControls: {
    overflow: 'hidden',
    transition: 'max-height 0.3s ease, opacity 0.25s ease',
  },
  headerControlsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '10px 16px',
    '@media (max-width: 899px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      gap: '10px',
      '& button': { minHeight: '40px' },
    },
  },
  filterGroups: {
    display: 'flex',
    alignItems: 'stretch',
    flex: '1 1 0%',
    minWidth: 0,
    gap: '14px',
    '@media (max-width: 899px)': {
      flexDirection: 'column',
      gap: '10px',
    },
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: '6px',
    minWidth: 0,
  },
  dlcGroup: {
    flex: '0 1 auto',
  },
  rarityGroup: {
    flex: '1 1 0%',
  },
  groupLabel: {
    fontSize: '10px',
    fontWeight: '700',
    lineHeight: 1,
    letterSpacing: '1.2px',
    textTransform: 'uppercase',
    color: '#a3adc2',
    whiteSpace: 'nowrap',
  },
  groupItemsRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    minWidth: 0,
    '& > button': {
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    '@media (max-width: 899px)': {
      flexWrap: 'nowrap',
      overflowX: 'auto',
      overflowY: 'hidden',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      padding: '4px 0',
      '&::-webkit-scrollbar': { display: 'none' },
    },
  },
  groupItemsRowEnd: {
    justifyContent: 'flex-end',
    '@media (max-width: 899px)': {
      justifyContent: 'flex-start',
    },
  },
  groupDivider: {
    flex: '0 0 auto',
    width: '1px',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.14)',
    '@media (max-width: 899px)': {
      width: 'auto',
      height: '1px',
    },
  },
  dlcToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    height: '34px',
    padding: '4px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    cursor: 'pointer',
    transition: 'opacity 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, background 0.15s ease',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.12)',
    },
    '&:focus-visible': {
      outline: '2px solid rgba(255, 139, 61, 0.5)',
      outlineOffset: '2px',
    },
  },
  dlcToggleImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: '5px',
    display: 'block',
  },
  dlcToggleText: {
    padding: '0 12px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.2px',
    color: '#ffffff',
    whiteSpace: 'nowrap',
  },
  dlcToggleActive: {
    borderColor: 'rgba(255, 139, 61, 0.55)',
    boxShadow: '0 0 0 2px rgba(255, 139, 61, 0.22)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dlcToggleInactive: {
    opacity: 0.4,
    filter: 'grayscale(0.9)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  searchBar: {
    width: '100%',
    height: '36px',
    padding: '6px 14px',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: '8px',
    outline: 'none',
    fontSize: '14px',
    boxSizing: 'border-box',
    backgroundColor: 'rgba(255,255,255,0.07)',
    color: '#e8eaf0',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
    '&::placeholder': { color: '#98a2b6' },
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
    '&:focus': {
      borderColor: '#ff8b3d',
      backgroundColor: 'rgba(255,255,255,0.1)',
      boxShadow: '0 0 0 3px rgba(255, 139, 61, 0.18)',
    },
    '@media (max-width: 639px)': {
      height: '40px',
      fontSize: '16px',
    },
  },
  filterOptions: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '8px',
  },
  resetFilterLink: {
    background: 'none',
    border: 'none',
    padding: '0 2px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.2px',
    color: '#e8802e',
    textDecoration: 'none',
    transition: 'color 0.15s ease',
    '&:hover': {
      color: '#f18c3c',
      textDecoration: 'underline',
    },
    '&:focus-visible': {
      outline: '2px solid rgba(232, 128, 46, 0.5)',
      outlineOffset: '2px',
      borderRadius: '4px',
    },
    '@media (max-width: 899px)': {
      padding: '0 6px',
      fontSize: '13px',
    },
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
    color: '#1f1a13',
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


  // Item views
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gap: '16px',
    '@media (min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '64px 16px',
    color: '#a3adc2',
    textAlign: 'center',
    fontSize: '14px',
    border: '1px dashed rgba(255,255,255,0.15)',
    borderRadius: '12px',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  emptyStateTitle: {
    fontWeight: '700',
    fontSize: '17px',
    color: '#c9d1e0',
  },
})
