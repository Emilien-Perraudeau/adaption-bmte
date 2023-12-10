import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, switchMap} from 'rxjs';
import { DishComponent} from "../shared/components/dish/dish.component";
import {TableComponent} from "../shared/components/table/table.component";


@Injectable({
  providedIn: 'root'
})
export class DishService {
  private baseUrl = 'http://localhost:3000/tables';

  constructor(private http: HttpClient) { }

  getDishes(): Observable<DishComponent[]> {
    return this.http.get<DishComponent[]>(this.baseUrl);
  }

  updateDish(dish: DishComponent): Observable<DishComponent> {
    return this.http.put<DishComponent>(`${this.baseUrl}/${dish.id}`, dish);
  }

  getTables(): Observable<TableComponent[]> {
    return this.http.get<TableComponent[]>('http://localhost:3000/tables');
  }

  updateTable(table: TableComponent): Observable<TableComponent> {
    console.log("update bien appelé")
    return this.http.put<TableComponent>(`http://localhost:3000/tables/${table.id}`, table);
  }




  updateDishInTable(dishToUpdate: DishComponent): Observable<TableComponent> {
    return this.http.get<TableComponent[]>(this.baseUrl).pipe(
      map(tables => {
        const table = tables.find(t => t.dishes.some(d => d.id === dishToUpdate.id));
        if (!table) {
          throw new Error('Table not found');
        }
        const dishIndex = table.dishes.findIndex(d => d.id === dishToUpdate.id);
        table.dishes[dishIndex] = dishToUpdate;
        return table;
      }),
      switchMap(table => this.http.put<TableComponent>(`${this.baseUrl}/${table.numberTable}`, table))
    );
  }

}
