import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DishComponent} from "../shared/components/dish/dish.component";


@Injectable({
  providedIn: 'root'
})
export class DishService {
  private baseUrl = 'http://localhost:3000/dishes';

  constructor(private http: HttpClient) { }

  getDishes(): Observable<DishComponent[]> {
    return this.http.get<DishComponent[]>(this.baseUrl);
  }



}
