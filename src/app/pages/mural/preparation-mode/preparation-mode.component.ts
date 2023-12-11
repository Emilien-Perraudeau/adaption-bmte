// preparation-mode.component.ts
import { Component, OnInit } from '@angular/core';
import { SharedDataService } from "../../../services/shared-data.service";
import { DishComponent } from "../../../shared/components/dish/dish.component";

@Component({
  selector: 'app-preparation-mode',
  templateUrl: './preparation-mode.component.html',
  styleUrls: ['./preparation-mode.component.css']
})
export class PreparationModeComponent implements OnInit {
  selectedDishes: DishComponent[] = [];
  currentStepIndex: Map<number, number> = new Map(); // Clé: id du plat, Valeur: index de l'étape actuelle

  constructor(private sharedDataService: SharedDataService) {}

  ngOnInit() {
    this.selectedDishes = this.sharedDataService.getSelectedDishes();
    this.selectedDishes.forEach(dish => this.currentStepIndex.set(dish.id, 0));
  }

  nextStep(dishId: number) {
    const dish = this.selectedDishes.find(dish => dish.id === dishId);
    if (dish) {
      const currentIndex = this.currentStepIndex.get(dishId) || 0;
      if (currentIndex < dish.recipe.length - 1) {
        this.currentStepIndex.set(dishId, currentIndex + 1);
      }
    } else {
      console.error('Dish not found for id:', dishId);
    }
  }


  isExpertMode(): boolean {
    return this.sharedDataService.getMode() === 'expert';
  }
}
