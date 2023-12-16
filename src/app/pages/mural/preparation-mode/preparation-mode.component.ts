// preparation-mode.component.ts
import { Component, OnInit } from '@angular/core';
import { SharedDataService } from "../../../services/shared-data.service";
import { DishComponent } from "../../../shared/components/dish/dish.component";
import {DishService} from "../../../services/dish.service";
import {DishState} from "../../../shared/enums/dish-state";
import {Router} from "@angular/router";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-preparation-mode',
  templateUrl: './preparation-mode.component.html',
  styleUrls: ['./preparation-mode.component.css']
})
export class PreparationModeComponent implements OnInit {
  selectedDishes: DishComponent[] = [];
  currentStepIndex = new Map<number, number>();

  constructor(private sharedDataService: SharedDataService,
              private dishService: DishService,
              private router: Router) {}

  ngOnInit() {
    this.selectedDishes = this.sharedDataService.getSelectedDishes();
    this.selectedDishes.forEach(dish => this.currentStepIndex.set(dish.id, 0));
    console.log(this.selectedDishes)
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

  validateDish(dishId: number, $event: Event) {
    $event.stopPropagation();
    this.dishService.getTables().subscribe(tables => {
      const tablesToUpdate = tables.filter(table => {
        let tableNeedsUpdate = false;
        const dishToUpdate = table.dishes.find(dish => dish.id === dishId);

        // Toggle entre DONE et IN_PROGRESS
        if (dishToUpdate) {
          if (dishToUpdate.state === DishState.Done) {
            dishToUpdate.state = DishState.InProgress;
          } else {
            dishToUpdate.state = DishState.Done;
          }
          tableNeedsUpdate = true;
        }

        return tableNeedsUpdate;
      });

      if (tablesToUpdate.length > 0) {
        const updateRequests = tablesToUpdate.map(table => this.dishService.updateTable(table));
        forkJoin(updateRequests).subscribe(results => {
          console.log('Tables updated:', results);

          // Mise à jour de l'état local du plat
          const localDish = this.selectedDishes.find(d => d.id === dishId);
          if (localDish) {
            localDish.state = localDish.state === DishState.Done ? DishState.InProgress : DishState.Done;
          }
        });
      }
    });
  }



  allDishesDone(): boolean {
    return this.selectedDishes.every(dish => dish.state === DishState.Done);
  }

  returnOnMode() {
    this.sharedDataService.clearSelectedDishes();
    const previousMode = this.sharedDataService.getPreviousMode();
    this.router.navigate([`/${previousMode}`]); // Redirige vers le mode précédent
  }

  hasNextStep(dishId: number): boolean {
    const currentIndex = this.currentStepIndex.get(dishId)!;
    const dish = this.selectedDishes.find(d => d.id === dishId);
    return dish ? currentIndex < dish.recipe.length - 1 : false;
  }

}
