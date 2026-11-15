import { makeAutoObservable } from "mobx";
import ror2_items from "./ror2_items.json";
import {
  loadStoredDisplayType,
  loadStoredDlcs,
  loadStoredFilters,
  loadStoredHeaderExpanded,
  saveDisplayType,
  saveDlcs,
  saveFilters,
  saveHeaderExpanded,
} from "./localStorage";
import {
  defaultDlcs,
  defaultFilters,
  DisplayType,
  dlcsAreDefault as dlcsSelectionIsDefault,
  RARITY_NAMES,
} from "./RiskOfRain2Types";

const rarityToString = (rarity: number) => RARITY_NAMES[rarity] ?? ''

class RiskOfRainUiState {

  private _displayType: DisplayType = 'grid';
  private _filters: Set<string> = new Set<string>();
  private _enabledDlcs: Set<string> = defaultDlcs();
  private _filteredList: any[] = [];
  private _list: any[] = [];
  private _searchQuery: string = '';


  // Header
  private _headerExpanded: boolean = true;

  // Flash Cards
  private _usedFlashCardItems: any[] = []
  private _currentItemToGuess: any = {}
  private _currentUsedItems: any[] = []
  private _itemsGuessed: any[] = []
  private _itemHasBeenGuessed: boolean = false

  // Tier List
  private _tierListSelectedCharacter: string = 'Commando';

  constructor() {
    const storedDisplayType = loadStoredDisplayType()
    if (storedDisplayType) this._displayType = storedDisplayType
    const storedFilters = loadStoredFilters()
    this._filters = storedFilters ? new Set<string>(storedFilters) : defaultFilters()
    const storedDlcs = loadStoredDlcs()
    this._enabledDlcs = storedDlcs ? new Set<string>(storedDlcs) : defaultDlcs()
    const storedHeaderExpanded = loadStoredHeaderExpanded()
    if (storedHeaderExpanded !== null) this._headerExpanded = storedHeaderExpanded

    this._list = (ror2_items as any[])
      .map((item, index) => ({ item, index }))
      .sort((a, b) => (Number(a.item.rarity) || 0) - (Number(b.item.rarity) || 0) || a.index - b.index)
      .map(({ item }) => item)
    this._filteredList = this._list

    makeAutoObservable(this)
    this.applyFilters()
  }

  get displayType() { return this._displayType; }
  get filters() { return this._filters; }
  get enabledDlcs() { return this._enabledDlcs; }
  get filteredList() { return this._filteredList; }
  get list() { return this._list; }
  get searchQuery() { return this._searchQuery; }
  get tierListSelectedCharacter() { return this._tierListSelectedCharacter; }
  // Header
  get headerExpanded() { return this._headerExpanded; }
  // Flash Cards
  get usedFlashCardItems() { return this._usedFlashCardItems; }
  get currentItemToGuess() { return this._currentItemToGuess; }
  get currentUsedItems() { return this._currentUsedItems; }
  get itemsGuessed() { return this._itemsGuessed; }
  get itemHasBeenGuessed() { return this._itemHasBeenGuessed; }

  set displayType(value: DisplayType) { this._displayType = value; }
  set filters(value: Set<string>) { this._filters = value; }
  set enabledDlcs(value: Set<string>) { this._enabledDlcs = value; }
  set filteredList(value: any[]) { this._filteredList = value; }
  set list(value: any[]) { this._list = value; }
  set searchQuery(value: string) { this._searchQuery = value; }
  set tierListSelectedCharacter(value: string) { this._tierListSelectedCharacter = value; }
  // Header
  set headerExpanded(value: boolean) { this._headerExpanded = value; }
  // Flash Cards
  set usedFlashCardItems(value: any[]) { this._usedFlashCardItems = value; }
  set currentItemToGuess(value: any) { this._currentItemToGuess = value; }
  set currentUsedItems(value: any[]) { this._currentUsedItems = value; }
  set itemsGuessed(value: any[]) { this._itemsGuessed = value; }
  set itemHasBeenGuessed(value: boolean) { this._itemHasBeenGuessed = value; }

  // Applies the search query, rarity filters and DLC toggles together
  public applyFilters = () => {
    const query = this.searchQuery.trim().toLowerCase()
    this.filteredList = this.list.filter((item) => {
      // Items without a dlc marker belong to the base game.
      if (!this.enabledDlcs.has(item.dlc ?? 'base')) return false
      if (this.filters.size > 0 && !this.filters.has(rarityToString(item.rarity))) return false
      if (!query) return true
      return item.displayName.toLowerCase().includes(query) ||
        item.nickname.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    })
  }

  public setDisplayType = (displayType: DisplayType) => {
    this.applyFilters()
    this.displayType = displayType
    saveDisplayType(displayType)
  }

  public setSearchQuery = (query: string) => {
    this.searchQuery = query
    this.applyFilters()
  }

  public addFilter = (filter: string) => {
    this.filters.add(filter)
    this.applyFilters()
    saveFilters(this.filters)
  }
  public removeFilter = (filter: string) => {
    this.filters.delete(filter)
    this.applyFilters()
    saveFilters(this.filters)
  }

  public resetFilters = () => {
    this.filters = defaultFilters()
    this.applyFilters()
    saveFilters(this.filters)
  }

  public dlcsAreDefault = (): boolean => dlcsSelectionIsDefault(this.enabledDlcs)

  public toggleDlc = (dlc: string) => {
    if (!this.enabledDlcs.delete(dlc)) {
      this.enabledDlcs.add(dlc)
    }
    this.applyFilters()
    saveDlcs(this.enabledDlcs)
  }

  public resetDlcs = () => {
    this.enabledDlcs = defaultDlcs()
    this.applyFilters()
    saveDlcs(this.enabledDlcs)
  }

  public toggleHeaderExpanded = () => {
    this.headerExpanded = !this.headerExpanded
    saveHeaderExpanded(this.headerExpanded)
  }

  addCurrentUsedItem = (item: any) => this.currentUsedItems.push(item)
  resetCurrentUsedItems = () => this.currentUsedItems = []

  addItemGuessed = (item: any) => this.itemsGuessed.push(item)
  resetItemsGuessed = () => this.itemsGuessed = []

  randomizeItemOrder = () => {
    this.currentUsedItems.sort(() => Math.random() - 0.5)
  }

  itemAlreadyPresent = (item: any) => {
    return this.currentUsedItems.some((usedItem) => usedItem.nickname === item.nickname)
  }
}

const riskOfRainUiState = new RiskOfRainUiState();
export default riskOfRainUiState;
