import { Component, OnInit } from '@angular/core';
import { TableService} from "../../../services/table.service";
import { TableComponent } from "../../../shared/components/table/table.component";

@Component({
  selector: 'app-normal-mode',
  templateUrl: './normal-mode.component.html',
  styleUrls: ['./normal-mode.component.css']
})
export class NormalModeComponent implements OnInit {
  tables: TableComponent[] = [];

  constructor(private tableService: TableService) {}

  ngOnInit() {
    this.tableService.getTables().subscribe(receivedTables => {
      this.tables = receivedTables;
    });
  }
}
