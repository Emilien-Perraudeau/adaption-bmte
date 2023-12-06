import {Component, Input, OnInit} from '@angular/core';
import {DishState} from "../../enums/dish-state";
import {SharedDataService} from "../../../services/shared-data.service";

@Component({
  selector: 'app-dish',
  templateUrl: './dish.component.html',
  styleUrls: ['./dish.component.css']
})
export class DishComponent implements OnInit {
  @Input() name!: string;
  @Input() image!: string;
  @Input() quantity!: number;
  @Input() category!: string;
  @Input() customerSpecification?: string[];
  @Input() state!: DishState;
  @Input() ingredients!: string[];
  @Input() recipeExpert!: string[];
  @Input() recipeNovice!: string[];
  @Input() isExpanded!: boolean;
  isSelected: boolean = false;

  constructor(private sharedDataService: SharedDataService) {}


  getColor(): string {
    console.log(this.state)
    switch (this.state) {
      case DishState.NotAssigned:
        return 'red';
      case DishState.InProgress:
        return 'orange';
      case DishState.Done:
        return 'green';
      default:
        return 'white';
    }
  }

  ngOnInit(): void {
    console.log(this)
  }

  checkboxChanged() {
    this.isSelected ? this.sharedDataService.selectDish(this) :
      this.sharedDataService.deselectDish(this);
  }

  getRecipeNovice(){
    return this.recipeNovice;
  }



}
