import { Injectable } from '@angular/core';
import { DishComponent} from "../shared/components/dish/dish.component";

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private selectedDishes = new Set<DishComponent>();
  private mode: 'expert' | 'novice' = 'novice';
  private isServeurMode: boolean = false
  private _numberOfCooks: 1 | 2 | 3 | 4 = 4;

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
}
