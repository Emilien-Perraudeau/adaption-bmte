import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {IngredientService} from "../../../services/ingredient.service";
import {DishService} from "../../../services/dish.service";

@Component({
  selector: 'app-modification-mode',
  templateUrl: './modification-mode.component.html',
  styleUrls: ['./modification-mode.component.css']
})
export class ModificationModeComponent implements OnInit {
  category: string | null | undefined;
  id: number | null | undefined;
  ingredients: any;
  recette: any;

  constructor(private route: ActivatedRoute,
              private ingredientService: IngredientService,
              private dishService: DishService) {}

  ngOnInit() {
    this.category = this.route.snapshot.paramMap.get('category');
    this.id = this.route.snapshot.paramMap.get('id') ? Number(this.route.snapshot.paramMap.get('id')) : null;

    this.getIngredients()
    this.getDishById(this.id);

    // Logique pour charger les données du plat si id est non null
  }
  getUrlFondEcran(categorie: string | null | undefined): string {
    if (!categorie) {
      return 'url(/chemin/vers/image-par-defaut.jpg)';
    }

    switch (categorie) {
      case 'Pâtes':
        return 'url(/chemin/vers/image-pates.jpg)';
      case 'Pizzas':
        return 'url(../../assets/images/pizza.jpg)';
      case 'Desserts':
        return 'url(/chemin/vers/image-desserts.jpg)';
      default:
        return 'url(/chemin/vers/image-par-defaut.jpg)';
    }
  }

  getIngredients() {
    this.ingredientService.getIngredients().subscribe(data => {
      this.ingredients = data;
    });
  }

  getDishById(id: number | null){
    this.dishService.getDishById(id).subscribe(data => {
      this.ingredients = data.ingredients;
      this.recette = data.recipe;
    });
  }
}
