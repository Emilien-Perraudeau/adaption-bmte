import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, map, Observable, switchMap} from 'rxjs';
import { DishComponent} from "../shared/components/dish/dish.component";
import {TableComponent} from "../shared/components/table/table.component";
import {io} from "socket.io-client";


@Injectable({
  providedIn: 'root'
})
export class DishService {
  private baseUrl = 'http://localhost:3000/tables';
  private socket;
  private tablesSubject = new BehaviorSubject<TableComponent[]>([]);

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3000');
    this.listenForChanges();
  }

  private listenForChanges() {
    this.socket.on('database_changed', () => {
      console.log('tables updated');
      this.getTables().subscribe(tables => {
        this.tablesSubject.next(tables);
      });
    });
  }

  getTablesUpdates(): Observable<TableComponent[]> {
    return this.tablesSubject.asObservable();
  }
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
