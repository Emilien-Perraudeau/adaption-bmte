import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {DishComponent} from "../shared/components/dish/dish.component";
import {IngredientComponent} from "../shared/components/ingredient/ingredient.component";
import {HttpClient} from "@angular/common/http";
import {io} from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private baseUrl = 'http://localhost:3000';
  private socket;
  private dishesSubject = new BehaviorSubject<DishComponent[]>([]);

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3000');
    this.listenForChanges();
  }

  private listenForChanges() {
    this.socket.on('database_changed', () => {
      console.log('dishes updated');
      this.getDishes().subscribe(dishes => {
        this.dishesSubject.next(dishes);
      });
    });
  }


  getDishes(): Observable<DishComponent[]> {
    return this.http.get<DishComponent[]>(this.baseUrl + 'dishes');
  }

  getIngredients(): Observable<DishComponent[]> {
    return this.http.get<DishComponent[]>(this.baseUrl + 'ingredients');
  }

}
