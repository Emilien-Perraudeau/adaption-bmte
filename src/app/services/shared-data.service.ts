import { Injectable } from '@angular/core';
import { DishComponent} from "../shared/components/dish/dish.component";

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private selectedDishes = new Set<DishComponent>();
  private mode: 'expert' | 'novice' = 'novice';

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
}
