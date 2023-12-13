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
  currentStepIndex = new Map<number, number>();
  currentRecipeInView: number | null = null;

  constructor(private sharedDataService: SharedDataService) {}

  ngOnInit() {
    this.selectedDishes = this.sharedDataService.getSelectedDishes();
    this.selectedDishes.forEach(dish => this.currentStepIndex.set(dish.id, 0));
  }

  nextStep(dishId: number) {
    const currentIndex = this.currentStepIndex.get(dishId) || 0;
    const dish = this.selectedDishes.find(d => d.id === dishId);

    if (dish && currentIndex < dish.recipe.length - 1) {
      this.currentStepIndex.set(dishId, currentIndex + 1);
    }
  }

  getCurrentStep(dishId: number): string {
    const currentIndex = this.currentStepIndex.get(dishId) || 0;
    const dish = this.selectedDishes.find(d => d.id === dishId);
    return dish?.recipe[currentIndex] ?? "Étape inconnue";
  }

  shouldShowStep(dishId: number): boolean {
    const currentIndex = this.currentStepIndex.get(dishId) || 0;
    const dish = this.selectedDishes.find(d => d.id === dishId);
    return dish ? currentIndex < (dish.recipe?.length ?? 0) : false;
  }

  closePopup() {
    this.currentRecipeInView = null;
  }

  selectRecipe(dishId: number): void {
    this.currentRecipeInView = dishId;
    // Initialisez ou réinitialisez l'indice de l'étape actuelle pour ce plat
    this.currentStepIndex.set(dishId, 0);
  }


  get currentDishName(): string {
    if (this.currentRecipeInView != null) {
      const currentDish = this.selectedDishes.find(dish => dish.id === this.currentRecipeInView);
      return currentDish ? currentDish.name : 'Nom inconnu';
    }
    return 'Aucun plat sélectionné';
  }

  isExpertMode(): boolean {
    return this.sharedDataService.getMode() === 'expert';
  }

  previousStep(dishId: number, event: MouseEvent) {
    event.stopPropagation();
    const currentIndex = this.currentStepIndex.get(dishId) || 0;
    if (currentIndex > 0) {
      this.currentStepIndex.set(dishId, currentIndex - 1);
    }
  }

  hasPreviousStep(dishId: number): boolean {
    const currentIndex = this.currentStepIndex.get(dishId) || 0;
    return currentIndex > 0;
  }

  openStepsPopup(dishId: number) {
    this.currentRecipeInView = dishId;
    this.currentStepIndex.set(dishId, 1);
  }

  hasNextStep(dishId: number): boolean {
    const currentIndex = this.currentStepIndex.get(dishId)!;
    const dish = this.selectedDishes.find(d => d.id === dishId);

    // Retourne false si currentIndex ou dish est undefined
    return dish ? currentIndex < dish.recipe.length - 1 : false;
  }
}
