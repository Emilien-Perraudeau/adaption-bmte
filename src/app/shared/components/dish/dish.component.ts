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
  isSelected: boolean = false;

  checkboxChanged() {
    if (this.isSelected) {
      // Logique à exécuter lorsque le plat est sélectionné
    } else {
      // Logique à exécuter lorsque le plat n'est plus sélectionné
    }
  }
}
