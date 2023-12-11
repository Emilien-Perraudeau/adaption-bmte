// ingredient.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.css']
})
export class IngredientComponent {
  @Input() name!: string;
  @Input() image!: string;
}
