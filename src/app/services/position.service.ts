import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PositionComponent} from "../shared/components/position/position.component";

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private baseUrl = 'http://localhost:3010/positions';

  constructor(private http: HttpClient) { }

  getPositions(): Observable<PositionComponent[]> {
    return this.http.get<PositionComponent[]>(this.baseUrl);
  }
}
