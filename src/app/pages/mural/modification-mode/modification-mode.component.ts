import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {IngredientService} from "../../../services/ingredient.service";
import {DishService} from "../../../services/dish.service";
import {IngredientComponent} from "../../../shared/components/ingredient/ingredient.component";
import {CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {DishComponent} from "../../../shared/components/dish/dish.component";

@Component({
  selector: 'app-modification-mode',
  templateUrl: './modification-mode.component.html',
  styleUrls: ['./modification-mode.component.css']
})
export class ModificationModeComponent implements OnInit {
  category!: string;
  id: number | null | undefined;
  ingredients: IngredientComponent[] = [];
  dishIngredients: IngredientComponent[] = [];
  @ViewChild('availableIngredientsList', { static: true }) availableIngredientsList: CdkDropList | undefined;
  angleDeRotation: number = 0;
  dish: DishComponent | null = null;

  constructor(private route: ActivatedRoute,
              private ingredientService: IngredientService,
              private dishService: DishService,
              private router: Router,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    const categoryParam = this.route.snapshot.paramMap.get('category');
    this.category = categoryParam ?? 'ValeurParDefaut';
    this.id = this.route.snapshot.paramMap.get('id') ? Number(this.route.snapshot.paramMap.get('id')) : null;

    this.getIngredients()
    this.getDishById(this.id);

    this.dishService.getSelectedDish().subscribe(dish => {
      this.dish = dish;
    });
  }

  getUrlFondEcran(categorie: string | null | undefined): string {
    console.log(categorie)

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
    if (this.dish) {
      this.dish.ingredients = this.dishIngredients;
    } else {
      console.error('Erreur : dish est null');
    }
    this.updateData();
  }

  getUniqueSteps(): string[] {
    console.log("dishingredient",this.dishIngredients);
    const steps = this.dishIngredients.map(ingredient => ingredient.step);
    return [...new Set(steps)];

  }

  swapEtape() {
    this.angleDeRotation += 180;
  }


  onStepDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      // Réarrangez simplement les objets dans `dishIngredients`
      moveItemInArray(this.dishIngredients, event.previousIndex, event.currentIndex);
      // Notez que `updateStepsOrder()` n'est pas nécessaire ici
    }
  }

  validerPlat() {
    if (this.id) {
      this.updateExistingDish();
    } else {
      this.createNewDish();
    }
    this.router.navigate(['/table-mode']);
  }

  updateExistingDish() {
    const dishToUpdate = {
      id: this.id,
      name: "nomTest",
      category: this.category,
      image: "assets/images/pizza_margherita.jpg",
      ingredients: this.dishIngredients,
      // autres propriétés si nécessaire
    };
    console.log(dishToUpdate)
    this.dishService.updateDish(dishToUpdate).subscribe(/* gérer la réponse */);
  }

  createNewDish() {
    this.dishService.getLastDishId().subscribe(lastId => {
      const newId = lastId + 1;
      const newDish = {
        id: newId,
        name: "nomTest",
        category: this.category,
        image: "assets/images/pizza_margherita.jpg",
        ingredients: this.dishIngredients,
      };
      this.dishService.createDish(newDish).subscribe(/* gérer la réponse */);
    });
  }

  updateData() {
    this.changeDetectorRef.detectChanges();
  }



}

