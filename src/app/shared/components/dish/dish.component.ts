import {Component, Input, OnInit} from '@angular/core';
import {RecipeComponent} from "../recipe/recipe.component"
import {DishState} from "../../enums/dish-state";

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
  @Input() recipe!: RecipeComponent;
  @Input() isExpanded!: boolean;
  @Input() state!: DishState;

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

}
