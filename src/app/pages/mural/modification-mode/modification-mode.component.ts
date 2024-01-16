import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {IngredientService} from "../../../services/ingredient.service";
import {DishService} from "../../../services/dish.service";
import {IngredientComponent} from "../../../shared/components/ingredient/ingredient.component";
import {CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-modification-mode',
  templateUrl: './modification-mode.component.html',
  styleUrls: ['./modification-mode.component.css']
})
export class ModificationModeComponent implements OnInit {
  category: string | null | undefined;
  id: number | null | undefined;
  ingredients: IngredientComponent[] = [];
  dishIngredients: IngredientComponent[] = [];
  @ViewChild('availableIngredientsList', { static: true }) availableIngredientsList: CdkDropList | undefined;
  angleDeRotation: number = 0;

  constructor(private route: ActivatedRoute,
              private ingredientService: IngredientService,
              private dishService: DishService) {
  }

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

  getDishById(id: number | null) {
    this.dishService.getDishById(id).subscribe(data => {
      console.log('Dish data:', data);
      this.dishIngredients = data.ingredients;  // Stocker les ingrédients du plat
      this.filterAvailableIngredients();  // Appeler la fonction de filtrage
    });
  }

  getIngredients() {
    this.ingredientService.getIngredients().subscribe(data => {
      console.log('Ingredients:', data);
      this.ingredients = data;
      this.filterAvailableIngredients();
    });
  }

  filterAvailableIngredients() {
    if (this.ingredients && this.dishIngredients) {
      const safeDishIngredients = this.dishIngredients || [];
      this.ingredients = this.ingredients.filter(ingredient =>
        !safeDishIngredients.some(dishIngredient => dishIngredient.id === ingredient.id));
    }
  }

  onDrop(event: CdkDragDrop<any[]>) {
    console.log(`Previous index: ${event.previousIndex}, Current index: ${event.currentIndex}`);
    const itemBeingMoved = event.previousContainer.data[event.previousIndex];

    console.log('Element being moved:', itemBeingMoved);

    if (event.previousContainer === event.container) {
      if (event.previousContainer === this.availableIngredientsList) {
        // Si l'événement provient de availableIngredientsList, inverser l'indice courant
        const currentIndex = event.container.data.length - 1 - event.currentIndex;
        moveItemInArray(event.container.data, currentIndex, event.previousIndex);
      } else {
        // Si l'événement provient d'une autre liste, utiliser la logique normale
        const currentIndex = event.container.data.findIndex((item: any) => item.id === itemBeingMoved.id);
        moveItemInArray(event.container.data, currentIndex, event.currentIndex);
      }
    } else {
      if (event.previousContainer === this.availableIngredientsList) {
        // Si l'événement provient de availableIngredientsList, inverser les indices
        const previousIndex = event.previousContainer.data.length - 1 - event.previousIndex;
        transferArrayItem(event.previousContainer.data, event.container.data, previousIndex, event.currentIndex);
      } else {
        // Si l'événement provient d'une autre liste, utiliser la logique normale
        const previousIndex = event.previousContainer.data.findIndex((item: any) => item.id === itemBeingMoved.id);
        transferArrayItem(event.previousContainer.data, event.container.data, previousIndex, event.currentIndex);
      }
    }

    console.log('After drop - Ingredients:', this.ingredients);
    console.log('After drop - Dish Ingredients:', this.dishIngredients);
  }

  getUniqueSteps(): string[] {
    console.log("dishingredient",this.dishIngredients);
    const steps = this.dishIngredients.map(ingredient => ingredient.step);
    return [...new Set(steps)];

  }

  swapEtape() {
    this.angleDeRotation += 180;
  }




}
