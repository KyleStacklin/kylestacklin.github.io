import { makeAutoObservable } from "mobx";
import ror2_items from "./ror2_items.json"

class RiskOfRainUiState {

  private _displayType: string = 'list';
  private _filters: Set<string> = new Set<string>();
  private _filteredList: any[] = [];
  private _list: any[] = [];


  // Header
  private _headerExpanded: boolean = false;

  // Flash Cards
  private _usedFlashCardItems: any[] = []
  private _currentItemToGuess: any = {}
  private _currentUsedItems: any[] = []
  private _itemsGuessed: any[] = []
  private _itemHasBeenGuessed: boolean = false

  // Tier List
  private _tierListSelectedCharacter: string = 'Commando';

  constructor() {
    this._filters = new Set<string>(
      ['Common', 'Uncommon', 'Legendary', 'Boss', 'Void', 'Lunar', 'Equipment']
    )
    this._filteredList = ror2_items as any[]
    this._list = ror2_items as any[]


    makeAutoObservable(this)
  }

  get displayType() { return this._displayType; }
  get filters() { return this._filters; }
  get filteredList() { return this._filteredList; }
  get list() { return this._list; }
  get tierListSelectedCharacter() { return this._tierListSelectedCharacter; }
  // Header
  get headerExpanded() { return this._headerExpanded; }
  // Flash Cards
  get usedFlashCardItems() { return this._usedFlashCardItems; }
  get currentItemToGuess() { return this._currentItemToGuess; }
  get currentUsedItems() { return this._currentUsedItems; }
  get itemsGuessed() { return this._itemsGuessed; }
  get itemHasBeenGuessed() { return this._itemHasBeenGuessed; }

  set displayType(value: string) { this._displayType = value; }
  set filters(value: Set<string>) { this._filters = value; }
  set filteredList(value: any[]) { this._filteredList = value; }
  set list(value: any[]) { this._list = value; }
  set tierListSelectedCharacter(value: string) { this._tierListSelectedCharacter = value; }
  // Header
  set headerExpanded(value: boolean) { this._headerExpanded = value; }
  // Flash Cards
  set usedFlashCardItems(value: any[]) { this._usedFlashCardItems = value; }
  set currentItemToGuess(value: any) { this._currentItemToGuess = value; }
  set currentUsedItems(value: any[]) { this._currentUsedItems = value; }
  set itemsGuessed(value: any[]) { this._itemsGuessed = value; }
  set itemHasBeenGuessed(value: boolean) { this._itemHasBeenGuessed = value; }

  public setDisplayType = (displayType: string) => {
    this.filteredList = this.list
    this.displayType = displayType
  }

  public addFilter = (filter: string) => this.filters.add(filter)
  public removeFilter = (filter: string) => this.filters.delete(filter)

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