import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, map, Observable, switchMap} from 'rxjs';
import { DishComponent} from "../shared/components/dish/dish.component";
import {TableComponent} from "../shared/components/table/table.component";
import {io} from "socket.io-client";
import {IngredientComponent} from "../shared/components/ingredient/ingredient.component";


@Injectable({
  providedIn: 'root'
})
export class DishService {
  private baseUrl = 'http://localhost:3010/dishes';
  private socket;
  private dishesSubject = new BehaviorSubject<DishComponent[]>([]);

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3010');
    this.listenForChanges();
  }

  private listenForChanges() {
    this.socket.on('database_changed', () => {
      console.log('dish updated');
      this.getDishes().subscribe(dishes => {
        this.dishesSubject.next(dishes);
      });
    });
  }

  getDishesUpdates(): Observable<DishComponent[]> {
    return this.dishesSubject.asObservable();
  }
  getDishes(): Observable<DishComponent[]> {
    return this.http.get<DishComponent[]>(this.baseUrl);
  }

  getDishById(id: number | null): Observable<DishComponent> {
    return this.http.get<DishComponent>(this.baseUrl + '/' + id);
  }

  updateDish(dish: {
    id: number | null | undefined;
    name: string;
    category: string
    image: string
    ingredients: IngredientComponent[];
  }): Observable<DishComponent> {
    return this.http.put<DishComponent>(`${this.baseUrl}/${dish.id}`, dish);
  }

  createDish(dish: {
    id: number | null | undefined;
    name: string
    category: string
    image: string
    ingredients: IngredientComponent[];
  }): Observable<DishComponent> {
    return this.http.post<any>(this.baseUrl, dish);
  }

  getTables(): Observable<TableComponent[]> {
    console.log('get tables - dish service');
    return this.http.get<TableComponent[]>('http://localhost:3005/tables');
  }

  updateTable(table: TableComponent): Observable<TableComponent> {
    console.log('update table - dish service');
    return this.http.put<TableComponent>(`http://localhost:3005/tables/${table.id}`, table);
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

  getLastDishId(): Observable<number> {
    return this.http.get<DishComponent[]>(this.baseUrl).pipe(
      map(dishes => {
        return dishes.reduce((maxId, dish) => Math.max(dish.id, maxId), 0);
      })
    );
  }

}
