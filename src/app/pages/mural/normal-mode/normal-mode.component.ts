import {Component, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {TableService} from "../../../services/table.service";
import {TableComponent} from "../../../shared/components/table/table.component";
import {Router} from "@angular/router";
import {SharedDataService} from "../../../services/shared-data.service";
import {forkJoin, Observable} from "rxjs";
import {DishState} from "../../../shared/enums/dish-state";
import {DishComponent} from "../../../shared/components/dish/dish.component";
import {HttpClient} from "@angular/common/http";
import {DishService} from "../../../services/dish.service";
import {TimelineComponent} from "../../../shared/components/timeline/timeline.component";

@Component({
  selector: 'app-normal-mode',
  templateUrl: './normal-mode.component.html',
  styleUrls: ['./normal-mode.component.css']
})
export class NormalModeComponent implements OnInit {

  tables: TableComponent[] = [];
  isTabletMode = false;
  timeline: { time: Date, color: string }[] = [];

  constructor(
    private tableService: TableService,
    private dishService: DishService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private _sharedDataService: SharedDataService,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.tableService.getTables().subscribe(receivedTables => {
      receivedTables.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
      this.tables = receivedTables;
      console.log(this.tables)
      this.tables.forEach(table => {
        this.timeline.push({ time: new Date(table.time), color: this.generateColor(table.id) });
        console.log("timeline "+ table.color)
      });
    });

    // Detect changes in screen size to determine tablet mode
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isTabletMode = result.matches;
      });

    if (this.checkIfRushMode()) this.router.navigate(['/rush-mode'])

  }

  checkIfRushMode() {
    const numberOfDishToBeInRushMode = 3*this._sharedDataService.numberOfCooks;
    const sommeTotale: number = this.tables.reduce((somme, table) => somme + this.getSommeDishComponentByTable(table), 0);
    return sommeTotale > numberOfDishToBeInRushMode && this._sharedDataService.numberOfCooks > 1;
  }

  getSommeDishComponentByTable(table: TableComponent): number {
    return table.dishes.length;
  }


  onPreparationMode() {
    this.dishService.getTables().subscribe(tables => {
      const selectedDishes = this._sharedDataService.getSelectedDishes();
      const tablesToUpdate = tables.filter(table => {
        let tableNeedsUpdate = false;
        table.dishes.forEach(dish => {
          const isSelected = selectedDishes.some(selectedDish => {
            return selectedDish.id === dish.id;
          });
          if (isSelected && dish.state === DishState.NotAssigned) {
            dish.state = DishState.InProgress;
            tableNeedsUpdate = true;
          }
        });
        return tableNeedsUpdate;
      });


      console.log('Tables to Update:', tablesToUpdate.length);
      if (tablesToUpdate.length > 0) {

        const updateRequests = tablesToUpdate.map(table => this.dishService.updateTable(table));
        forkJoin(updateRequests).subscribe(results => {
          console.log('All tables updated:', results);
          this.router.navigate(['/preparation-mode']);
        });
      } else {
        this.router.navigate(['/preparation-mode']);
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
        "numberOrder": 202,
        "time": "2023-12-06T16:00:00.000Z",
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
        totalDishes += table.dishes.length;
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

}
