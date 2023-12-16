import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableComponent } from "../shared/components/table/table.component";

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private baseUrl = 'http://localhost:3000/tables';

  constructor(private http: HttpClient) { }

  getTables(): Observable<TableComponent[]> {
    return this.http.get<TableComponent[]>(this.baseUrl);
  }

  addTable(nouvelleTable: any): Observable<any> {
    return this.http.post(this.baseUrl, nouvelleTable);
  }

  updateTablesAfterAddition(): Observable<TableComponent[]> {
    return this.http.get<TableComponent[]>(this.baseUrl);
  }

  deleteTable(tableId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${tableId}`);
  }
}
