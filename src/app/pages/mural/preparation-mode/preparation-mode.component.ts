import { Component, OnInit } from '@angular/core';
import { SharedDataService} from "../../../services/shared-data.service";
import {DishComponent} from "../../../shared/components/dish/dish.component";

@Component({
  selector: 'app-preparation-mode',
  templateUrl: './preparation-mode.component.html'
})
export class PreparationModeComponent implements OnInit {
  selectedDishes: DishComponent[] = [];

  constructor(private sharedDataService: SharedDataService) {}

  ngOnInit() {
    this.selectedDishes = this.sharedDataService.getSelectedDishes();
  }


  isExpertMode(): boolean {
    return this.sharedDataService.getMode() === 'expert';
  }
}
