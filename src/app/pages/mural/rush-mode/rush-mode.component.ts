import { Component, OnInit } from '@angular/core';
import { TableService } from "../../../services/table.service";
import { DishComponent } from "../../../shared/components/dish/dish.component";
import { TableComponent } from "../../../shared/components/table/table.component";
import {DishState} from "../../../shared/enums/dish-state";
import {SharedDataService} from "../../../services/shared-data.service";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
  selector: 'app-rush-mode',
  templateUrl: './rush-mode.component.html',
  styleUrls: ['./rush-mode.component.css']
})
export class RushModeComponent implements OnInit {
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

  constructor(private tableService: TableService, private sharedDataService: SharedDataService, private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.availableCooks = this.sharedDataService.numberOfCooks;
    console.log("maxCategoriesToShow "+ this.availableCooks)
    this.tableService.getTables().subscribe(receivedTables => {
      receivedTables.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

      this.tables = receivedTables;

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
    this.groupedDishes.forEach((dishes, category) => {
      if (dishes.length > 4 || this.groupedDishes.size >= this.availableCooks) {
        this.upcomingDishes.set(category,  dishes.length > 4  ? dishes.length - 4 : dishes.length);
        this.groupedDishes.set(category, dishes.slice(0, 4));
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

  get visibleCategories(): string[] {
    return this.groupedDishesCategories.slice(0, this.availableCooks);
  }

  get hiddenCategories(): string[] {
    return this.groupedDishesCategories.slice(this.availableCooks);
  }

  getTableNumberForDish(dish: DishComponent): number  {
    for (let [tableNumber, tableDish] of this.dishesPerTable) {
      if (tableDish === dish) {
        return tableNumber;
      }
    }
    return -1;
  }

  generateColor(tableId: number): string {
    const hue = (tableId * 137.508) % 360;
    return `hsl(${hue}, 70%, 70%)`;
  }
}
