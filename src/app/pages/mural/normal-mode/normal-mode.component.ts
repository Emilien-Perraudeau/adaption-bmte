import {Component, OnDestroy, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {TableService} from "../../../services/table.service";
import {TableComponent} from "../../../shared/components/table/table.component";
import {Router} from "@angular/router";
import {SharedDataService} from "../../../services/shared-data.service";
import {forkJoin, Observable, Subscription} from "rxjs";
import {DishState} from "../../../shared/enums/dish-state";
import {DishService} from "../../../services/dish.service";

@Component({
  selector: 'app-normal-mode',
  templateUrl: './normal-mode.component.html',
  styleUrls: ['./normal-mode.component.css']
})
export class NormalModeComponent implements OnInit, OnDestroy {

  tables: TableComponent[] = [];
  isTabletMode = false;
  timeline: { time: Date, color: string }[] = [];
  private subscription = new Subscription();

  constructor(
    private tableService: TableService,
    private dishService: DishService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private _sharedDataService: SharedDataService,
  ) {
  }

  ngOnInit() {
    this.tableService.getTables().subscribe(tables => {
      tables.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
      this.tables = tables;
      this.timeline = [];
      this.tables.forEach(table => {
        this.timeline.push({ time: new Date(table.time), color: this.generateColor(table.id) });
      });
    });

    this.subscription.add(this.tableService.getTablesUpdates().subscribe(receivedTables => {
      receivedTables.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
      this.tables = receivedTables;
      console.log(this.tables)
      this.timeline = [];
      this.tables.forEach(table => {
        this.timeline.push({ time: new Date(table.time), color: this.generateColor(table.id) });
        console.log("timeline "+ table.color)
      });
      if (this.checkIfRushMode()) this.router.navigate(['/rush-mode'])
    }));

    // Detect changes in screen size to determine tablet mode
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isTabletMode = result.matches;
      });

    if (this.checkIfRushMode()) {
      this.router.navigate(['/rush-mode']);
    }

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  checkIfRushMode() {
    const numberOfDishToBeInRushMode = 4*this._sharedDataService.numberOfCooks;
    // Si le mode serveur est activé, ne pas passer au rush-mode
    if (this._sharedDataService.getServeurMode()) {
      return false;
    }

    const sommeTotale: number = this.tables.reduce((somme, table) => somme + this.getSommeDishComponentByTable(table), 0);
    return sommeTotale > numberOfDishToBeInRushMode && this._sharedDataService.numberOfCooks > 1;
  }

  getSommeDishComponentByTable(table: TableComponent): number {
    return table.dishes.length;
  }

  onPreparationMode() {
    this.sharedDataService.setPreviousMode("normal-mode");
    const numberOfCooks = this.sharedDataService.numberOfCooks;
    const isSingleCook = numberOfCooks === 1;

    this.dishService.getTables().subscribe(tables => {
      // Cas où il y a un seul cuisinier
      if (isSingleCook) {
        const selectedTables = this.sharedDataService.getTables();
        selectedTables.forEach(table => {
          table.dishes.forEach(dish => {
            dish.state = DishState.InProgress;
            this.sharedDataService.selectDish(dish);
          });
        });
        this.router.navigate(['/preparation-mode']);
      }
      // Cas normal avec plusieurs cuisiniers
      else {
        const selectedDishes = this.sharedDataService.getSelectedDishes();
        const tablesToUpdate = tables.filter(table => {
          let tableNeedsUpdate = false;
          table.dishes.forEach(dish => {
            const isSelected = selectedDishes.some(selectedDish => selectedDish.id === dish.id);
            if (isSelected && dish.state === DishState.NotAssigned) {
              dish.state = DishState.InProgress;
              tableNeedsUpdate = true;
            }
          });
          return tableNeedsUpdate;
        });

        if (tablesToUpdate.length > 0) {
          const updateRequests = tablesToUpdate.map(table => this.dishService.updateTable(table));
          forkJoin(updateRequests).subscribe(results => {
            console.log('All tables updated:', results);
            this.router.navigate(['/preparation-mode']);
          });
        } else {
          this.router.navigate(['/preparation-mode']);
        }
      }
    });
  }


  onRushMode() {
    this.router.navigate(['/rush-mode'])
  }

  ajouterNouvelleTable() {
    const id = Math.random();
    // Générer une nouvelle table
    const nouvelleTable = {
        "id": id,
        "numberTable": Math.floor(Math.random() * 20) + 1,
        "numberOrder": 202 + Math.floor(Math.random() * 20) + 1,
        "time": Date.now(),
        "dishes": [
          {
            "id": 1,
            "tableId": id,
            "name": "Pizza Margherita",
            "category": "Pizzas",
            "image": "assets/images/pizza_margherita.jpg",
            "quantity": 5,
            "state": "NOT_ASSIGNED",
            "ingredients": [
              "ingredient1",
              "ingredient2"
            ],
            "recipeExpert": [
              "Étape Expert 1 pour Pizza Margherita",
              "Étape Expert 2 pour Pizza Margherita"
            ],
            "recipeNovice": [
              "Étape Novice 1 pour Pizza Margherita",
              "Étape Novice 2 pour Pizza Margherita"
            ]
          },
          {
            "id": 2,
            "tableId": id,
            "name": "Pâtes Carbonara",
            "category": "Pâtes",
            "image": "assets/images/pates_carbonara.jpg",
            "quantity": 2,
            "state": "NOT_ASSIGNED",
            "ingredients": [
              "ingredient1",
              "ingredient2"
            ],
            "recipeExpert": [
              "Étape Expert 1 pour Pâtes Carbonara",
              "Étape Expert 2 pour Pâtes Carbonara"
            ],
            "recipeNovice": [
              "Étape Novice 1 pour Pâtes Carbonara",
              "Étape Novice 2 pour Pâtes Carbonara"
            ]
          },
          {
            "id": 3,
            "tableId": id,
            "name": "Tiramisu",
            "category": "Desserts",
            "image": "assets/images/tiramisu.jpg",
            "quantity": 3,
            "state": "NOT_ASSIGNED",
            "ingredients": [
              "ingredient1",
              "ingredient2"
            ],
            "recipeExpert": [
              "Étape Expert 1 pour Tiramisu",
              "Étape Expert 2 pour Tiramisu"
            ],
            "recipeNovice": [
              "Étape Novice 1 pour Tiramisu",
              "Étape Novice 2 pour Tiramisu"
            ]
          },
          {
            "id": 4,
            "tableId": id,
            "name": "Bruschetta",
            "category": "Entrées",
            "image": "assets/images/bruschetta.jpg",
            "quantity": 2,
            "state": "NOT_ASSIGNED",
            "ingredients": [
              "ingredient1",
              "ingredient2"
            ],
            "recipeExpert": [
              "Étape Expert 1 pour Bruschetta",
              "Étape Expert 2 pour Bruschetta"
            ],
            "recipeNovice": [
              "Étape Novice 1 pour Bruschetta",
              "Étape Novice 2 pour Bruschetta"
            ]
          }
        ]
      };

    this.tableService.addTable(nouvelleTable).subscribe(response => {
      console.log('Nouvelle table ajoutée avec succès :', response);

      this.tableService.updateTablesAfterAddition().subscribe((tables: TableComponent[]) => {
        this.tables = tables;
      });
      this.timeline = [];
      this.tables.forEach(table => {
        this.timeline.push({ time: new Date(table.time), color: table.color });
      });
    });


    if (this.checkIfRushMode()) this.router.navigate(['/rush-mode']);
  }


  isAnyDishSelected(): boolean {
    return this._sharedDataService.getSelectedDishes().length > 0;
  }

  resetDishesState() {
    this.dishService.getTables().subscribe(tables => {
      tables.forEach(table => {
        let tableNeedsUpdate = false;

        table.dishes.forEach(dish => {
          if (dish.state !== DishState.NotAssigned) {
            dish.state = DishState.NotAssigned;
            tableNeedsUpdate = true;
          }
        });

        if (tableNeedsUpdate) {
          this.dishService.updateTable(table).subscribe(updatedTable => {
            console.log('Table updated after reset:', updatedTable);
          });
        }
      });
    });
  }

  generateColor(tableId: number): string {
    const hue = (tableId * 137.508) % 360;
    return `hsl(${hue}, 70%, 70%)`;
  }

  numberOfCooks(): number {
    return this._sharedDataService.numberOfCooks;
  }

  getTotalDishesCount(): number {
    let totalDishes = 0;
    for (const table of this.tables) {
      if (table.dishes) {
        for (const dish of table.dishes) {
          totalDishes += dish.quantity;
        }
      }
    }
    return totalDishes;
  }


  getTotalRemainingDishesCount(): number {
    let totalRemainingDishes = 0;
    for (let i = 7; i < this.tables.length; i++) {
      const table = this.tables[i];
      if (table.dishes) {
        totalRemainingDishes += table.dishes.length;
      }
    }
    return totalRemainingDishes;
  }

  get sharedDataService(): SharedDataService {
    return this._sharedDataService;
  }

  onValidateMode() {
    const tables = Array.from(this.sharedDataService.getTables());
    const selectedTables = tables.filter(table => table.isSelected && table.isAllStatesGreen());

    selectedTables.forEach(table => {
      // Supprimez la table de la base de données ou effectuez d'autres actions nécessaires
      this.tableService.deleteTable(table.id).subscribe(() => {
        console.log(`Table ${table.numberTable} validée et supprimée`);
        // Mettez à jour la liste des tables dans SharedDataService
        this.updateTablesAfterDeletion(table.id);
      });
    });
  }

  private updateTablesAfterDeletion(tableId: number) {
    let tables = Array.from(this.sharedDataService.getTables());
    tables = tables.filter(table => table.id !== tableId);
    this.sharedDataService.setTables(new Set(tables));
  }

  isAnyTableSelected(): boolean {
    return this.sharedDataService.isAnyTableSelected();
  }


}
