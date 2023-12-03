import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecipeComponent} from "../shared/components/recipe/recipe.component";

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private baseUrl = 'http://localhost:3000/recipes';

  constructor(private http: HttpClient) { }

  getRecipes(): Observable<RecipeComponent[]> {
    return this.http.get<RecipeComponent[]>(this.baseUrl);
  }
}
