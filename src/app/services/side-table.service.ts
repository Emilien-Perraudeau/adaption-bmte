import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SideTableComponent} from "../shared/components/side-table/side-table.component";

@Injectable({
  providedIn: 'root'
})
export class SideTableService {
  private baseUrl = 'http://localhost:3000/sideTables';

  constructor(private http: HttpClient) { }

  getSideTables(): Observable<SideTableComponent[]> {
    return this.http.get<SideTableComponent[]>(this.baseUrl);
  }
}
