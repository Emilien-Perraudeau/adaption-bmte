// ingredient.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.css']
})
export class IngredientComponent {
  @Input() id!: number;
  @Input() name!: string;
  @Input() image!: string;
  @Input() step!: string;  // Ajout de la nouvelle propriété
}

