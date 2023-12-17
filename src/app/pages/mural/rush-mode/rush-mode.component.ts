import {Component, OnDestroy, OnInit} from '@angular/core';
import { TableService } from "../../../services/table.service";
import { DishComponent } from "../../../shared/components/dish/dish.component";
import { TableComponent } from "../../../shared/components/table/table.component";
import {DishState} from "../../../shared/enums/dish-state";
import {SharedDataService} from "../../../services/shared-data.service";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {forkJoin, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {DishService} from "../../../services/dish.service";

@Component({
  selector: 'app-rush-mode',
  templateUrl: './rush-mode.component.html',
  styleUrls: ['./rush-mode.component.css']
})
export class RushModeComponent implements OnInit, OnDestroy {
  isTabletMode = false;
  position_category = "Pizzas";
  DishState = DishState;
  availableCooks = 0;
  groupedDishesCategories: string[] = [];
  upcomingDishesCategories: string[] = [];
  groupedDishesForView: { [category: string]: DishComponent[] } = {};
  upcomingDishesForView: { [category: string]: DishComponent[][] } = {};

  tables: TableComponent[] = [];
  dishes: DishComponent[] = [];
  dishesPerTable = new Map<number, DishComponent>();
  groupedDishes = new Map<string, DishComponent[]>();
  upcomingDishes = new Map<string, number>();
  upcomingDishesByCategory = new Map<string, DishComponent[]>();
  timeline: { time: Date, color: string }[] = [];
  private subscription = new Subscription();

  constructor(private tableService: TableService,
              private _sharedDataService: SharedDataService,
              private breakpointObserver: BreakpointObserver,
              private router: Router,
              private dishService: DishService) {}

  ngOnInit(): void {
    this.availableCooks = this.sharedDataService.numberOfCooks;
    this.tableService.getTables().subscribe(receivedTables => {
      receivedTables.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

      this.tables = receivedTables;
      this.timeline = [];
      this.tables.forEach(table => {
        this.timeline.push({ time: new Date(table.time), color: this.generateColor(table.id) });
        console.log("timeline "+ table.color)
      });

      this.populateDishesWithTables();
      this.updateViewData();

      this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
        .subscribe(result => {
          this.isTabletMode = result.matches;
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

      this.populateDishesWithTables();
      this.updateViewData();
    }));
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isTabletMode = result.matches;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  updateViewData(): void {
    this.groupedDishesCategories = Array.from(this.groupedDishes.keys());
    this.upcomingDishesCategories = Array.from(this.upcomingDishesByCategory.keys());

    this.groupedDishes.forEach((dishes, category) => {
      this.groupedDishesForView[category] = dishes;
    });

    this.upcomingDishesByCategory.forEach((dishes, category) => {
      this.upcomingDishesForView[category] = dishes.map(dish => [dish]);
    });

  }

  populateDishesWithTables() {
    this.tables.forEach(table => {
      table.dishes.forEach(dish => {
        this.dishes.push(dish);
        this.dishesPerTable.set(table.numberTable, dish);
      });
    });

    this.groupDishesByCategory();
  }

  groupDishesByCategory() {
    this.dishes.forEach(dish => {
      const category = dish.category;
      if (this.groupedDishes.has(category)) {
        const categoryDishes = this.groupedDishes.get(category);
        if (categoryDishes) {
          categoryDishes.push(dish);
        }
      } else {
        this.groupedDishes.set(category, [dish]);
      }
    });

    this.calculateUpcomingDishes();
  }

  calculateUpcomingDishes() {
    console.log('Calculating upcoming dishes');
    this.groupedDishes.forEach((dishes, category) => {
      const numberOfPlatsVisible = Math.min(dishes.length, 4);
      this.groupedDishes.set(category, dishes.slice(0, numberOfPlatsVisible));
      if (dishes.length > 4) {
        this.upcomingDishes.set(category, dishes.length - numberOfPlatsVisible);
        this.upcomingDishesByCategory.set(category, dishes.slice(numberOfPlatsVisible));
      } else {
        this.upcomingDishes.set(category, 0);
      }
    });
    this.prepareUpcomingDishes();
  }


  prepareUpcomingDishes() {
    this.groupedDishes.forEach((dishes, category) => {
      if (dishes.length > 4 || this.groupedDishesCategories.length > this.availableCooks) {
        const remainingDishes = dishes.slice(4);
        this.upcomingDishesForView[category] = this.chunkArray(remainingDishes, 4);
      } else {
        this.upcomingDishesForView[category] = dishes.map(dish => [dish]);
      }
    });
    this.updateViewData();
  }


  chunkArray(array: DishComponent[], size: number): DishComponent[][] {
    let result: DishComponent[][] = [];
    for (let i = 0; i < array.length; i += size) {
      let chunk = array.slice(i, i + size);
      result.push(chunk);
    }
    return result;
  }

  getTableNumberForDish(dish: DishComponent): number  {
    for (let [tableNumber, tableDish] of this.dishesPerTable) {
      if (tableDish === dish) {
        return tableNumber;
      }
    }
    return -1;
  }

  get sharedDataService(): SharedDataService {
    return this._sharedDataService;
  }

  generateColor(tableId: number): string {
    const hue = (tableId * 137.508) % 360;
    return `hsl(${hue}, 70%, 70%)`;
  }

  isAnyDishSelected(): boolean {
    return this.sharedDataService.getSelectedDishes().length > 0;
  }

  isAnyTableSelected(): boolean {
    return this.sharedDataService.isAnyTableSelected();
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

  onPreparationMode() {
    this.sharedDataService.setPreviousMode("normal-mode");
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
}
