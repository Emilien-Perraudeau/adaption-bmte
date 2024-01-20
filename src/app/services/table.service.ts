import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { TableComponent } from "../shared/components/table/table.component";
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private baseUrl = 'http://localhost:3005/tables';
  private socket;
  private tablesSubject = new BehaviorSubject<TableComponent[]>([]);

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3005');
    this.listenForChanges();
  }

  private listenForChanges() {
    console.log('listen for changes');
    this.socket.on('tableUpdated', () => {
      console.log('tables updated');
      this.getTables().subscribe(tables => {
        this.tablesSubject.next(tables);
      });
    });
  }

  getTables(): Observable<TableComponent[]> {
    console.log('get tables');
    return this.http.get<TableComponent[]>(this.baseUrl);
  }

  getTablesUpdates(): Observable<TableComponent[]> {
    console.log('get tables updates');
    return this.tablesSubject.asObservable();
  }

  addTable(nouvelleTable: any): Observable<any> {
    console.log('add table');
    return this.http.post(this.baseUrl, nouvelleTable);
  }

  deleteTable(tableId: number): Observable<any> {
    console.log('delete table');
    return this.http.delete(`${this.baseUrl}/${tableId}`);
  }

  updateTablesAfterAddition(): Observable<TableComponent[]> {
    console.log('update tables after addition');
    return this.http.get<TableComponent[]>(this.baseUrl);
  }

}
