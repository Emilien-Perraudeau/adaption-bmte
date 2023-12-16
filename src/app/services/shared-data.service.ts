import { Injectable } from '@angular/core';
import { DishComponent} from "../shared/components/dish/dish.component";
import {TableComponent} from "../shared/components/table/table.component";

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private selectedDishes = new Set<DishComponent>();
  private mode: 'expert' | 'novice' = 'novice';
  private isServeurMode: boolean = false
  private _numberOfCooks: 1 | 2 | 3 | 4 = 4;
  private previousMode: 'normal-mode' | 'rush-mode' = 'normal-mode';
  private selectedTables = new Set<TableComponent>();

  selectDish(dish: DishComponent): void {
    this.selectedDishes.add(dish);
  }

  deselectDish(dish: DishComponent): void {
    this.selectedDishes.delete(dish);
  }

  getSelectedDishes(): DishComponent[] {
    return Array.from(this.selectedDishes);
  }

  setMode(mode: 'expert' | 'novice'): void {
    this.mode = mode;
  }

  getMode(): 'expert' | 'novice' {
    return this.mode;
  }

  get numberOfCooks(): 1 | 2 | 3 | 4 {
    return this._numberOfCooks;
  }

  set numberOfCooks(value: 1 | 2 | 3 | 4) {
    this._numberOfCooks = value;
  }

  getServeurMode(): boolean {
    return this.isServeurMode;
  }

  setServeurMode(isServeurMode: boolean): void {
    this.isServeurMode = isServeurMode;
  }

  setPreviousMode(mode: 'normal-mode' | 'rush-mode') {
    this.previousMode = mode;
  }

  getPreviousMode(): 'normal-mode' | 'rush-mode' {
    return this.previousMode;
  }

  clearSelectedDishes() {
    this.selectedDishes.clear();
  }

  addTables(table: TableComponent): void {
    console.log()
    this.selectedTables.add(table);
  }

  getTables(): Set<TableComponent> {
    return this.selectedTables;
  }

  isAnyTableSelected(): boolean {
    console.log(this.selectedTables.size)
    return this.selectedTables.size > 0;
  }

  setTables(tables: Set<TableComponent>): void {
    this.selectedTables = tables;
  }
}
