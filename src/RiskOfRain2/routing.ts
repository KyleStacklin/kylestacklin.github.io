import { DisplayType } from './RiskOfRain2Types'

export const DISPLAY_TYPE_PATHS: Record<DisplayType, string> = {
  grid: '/',
  list: '/list',
  flashCards: '/flashcards',
}

export const pathToDisplayType = (path: string): DisplayType | null => {
  const match = (Object.keys(DISPLAY_TYPE_PATHS) as DisplayType[]).find(
    (displayType) => DISPLAY_TYPE_PATHS[displayType] === path
  )
  return match ?? null
}

export const resolveInitialPath = (rawHash: string, storedRoute: string | null): string => {
  const hashPath = (rawHash.startsWith('#') ? rawHash.slice(1) : rawHash).trim()
  if (hashPath !== '') {
    return pathToDisplayType(hashPath) ? hashPath : '/'
  }
  return storedRoute && pathToDisplayType(storedRoute) ? storedRoute : '/'
}
