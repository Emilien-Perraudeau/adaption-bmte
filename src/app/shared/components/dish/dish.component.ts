import {Component, Input, OnInit} from '@angular/core';
import {RecipeComponent} from "../recipe/recipe.component"

@Component({
  selector: 'app-dish',
  templateUrl: './dish.component.html',
  styleUrls: ['./dish.component.css']
})
export class DishComponent {
  @Input() name!: string;
  @Input() image!: string;
  @Input() quantity!: number;
  @Input() category!: string;
  @Input() customerSpecification?: string[];
  @Input() recipe!: RecipeComponent;
  @Input() isExpanded!: boolean;
}
