import { Component, OnInit } from '@angular/core';
import { DishService } from "../../../services/dish.service";
import { TableService } from "../../../services/table.service";
import { DishComponent } from "../../../shared/components/dish/dish.component";
import { TableComponent } from "../../../shared/components/table/table.component";

@Component({
  selector: 'app-rush-mode',
  templateUrl: './rush-mode.component.html',
  styleUrls: ['./rush-mode.component.css']
})
export class RushModeComponent implements OnInit {
  dishes: DishComponent[] = [];
  tables: TableComponent[] = [];
  groupedDishes = new Map<string, DishComponent[]>();
  upcomingDishes = new Map<string, number>();
  upcomingDishesByCategory = new Map<string, DishComponent[][]>();

  constructor(private dishService: DishService, private tableService: TableService) {}

  ngOnInit(): void {
    console.log('Rush mode component initialized');
    this.tableService.getTables().subscribe(receivedTables => {
      this.tables = receivedTables;
    });
    this.dishService.getDishes().subscribe(receivedDishes => {
      this.dishes = receivedDishes;
      this.groupDishesByCategory();
    });
  }

  groupDishesByCategory() {
    this.dishes.forEach(dish => {
      const category = dish.category;
      if (!this.groupedDishes.has(category)) {
        this.groupedDishes.set(category, []);
      }
      const categoryDishes = this.groupedDishes.get(category);
      if (categoryDishes) {
        for (let i = 0; i < dish.quantity; i++) {
          categoryDishes.push(dish);
        }
      }
    });

    this.calculateUpcomingDishes();
    console.log(this.groupedDishes);
  }


  calculateUpcomingDishes() {
    this.groupedDishes.forEach((dishes, category) => {
      if (dishes.length > 4) {
        this.upcomingDishes.set(category, dishes.length - 4);
        this.groupedDishes.set(category, dishes.slice(0, 4));
      } else {
        this.upcomingDishes.set(category, 0);
      }
    });
    console.log(this.upcomingDishes);
    this.prepareUpcomingDishes()
  }

  prepareUpcomingDishes() {
    this.upcomingDishes.forEach((count, category) => {
      console.log(count, category)
      if (count > 0) {
        const allDishesInCategory = this.dishes.filter(dish => dish.category === category);
        const upcomingDishesInCategory = allDishesInCategory.slice(4);
        this.upcomingDishesByCategory.set(category, this.chunkArray(upcomingDishesInCategory, 4));
      }
    });
    console.log(this.upcomingDishesByCategory)
  }

  chunkArray(array: any[], size: number): any[][] {
    const chunkedArr = [];
    let index = 0;
    while (index < array.length) {
      chunkedArr.push(array.slice(index, size + index));
      index += size;
    }
    return chunkedArr;
  }
}
