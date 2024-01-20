import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { TableComponent } from "../shared/components/table/table.component";
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private baseUrl = 'http://localhost:3010/tables';
  private socket;
  private tablesSubject = new BehaviorSubject<TableComponent[]>([]);

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3010');
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

  getTables(): Observable<TableComponent[]> {
    return this.http.get<TableComponent[]>(this.baseUrl);
  }

  getTablesUpdates(): Observable<TableComponent[]> {
    return this.tablesSubject.asObservable();
  }

  addTable(nouvelleTable: any): Observable<any> {
    return this.http.post(this.baseUrl, nouvelleTable);
  }

  deleteTable(tableId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${tableId}`);
  }

  updateTablesAfterAddition(): Observable<TableComponent[]> {
    return this.http.get<TableComponent[]>(this.baseUrl);
  }

}
