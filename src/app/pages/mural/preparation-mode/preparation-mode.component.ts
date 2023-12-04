import { Component, Input } from '@angular/core';
import {DishComponent} from "../../../shared/components/dish/dish.component";

@Component({
  selector: 'app-preparation-mode',
  templateUrl: './preparation-mode.component.html',
  styleUrls: ['./preparation-mode.component.css']
})
export class PreparationModeComponent {
  @Input() selectedDishes!: DishComponent[]; // Dish est un exemple de type, à remplacer par votre type réel

  toggleRecipe(dish: DishComponent): void {
    dish.isExpanded = !dish.isExpanded;
  }
}
