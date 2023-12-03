import { Component, OnInit } from '@angular/core';
import { TableService} from "../../../services/table.service";
import { SideTableService} from "../../../services/side-table.service";
import { TableComponent } from "../../../shared/components/table/table.component";
import { SideTableComponent } from "../../../shared/components/side-table/side-table.component";

@Component({
  selector: 'app-normal-mode',
  templateUrl: './normal-mode.component.html',
  styleUrls: ['./normal-mode.component.css']
})
export class NormalModeComponent implements OnInit {
  tables: TableComponent[] = [];
  sideTable: SideTableComponent | null = null;

  constructor(private tableService: TableService, private sideTableService: SideTableService) {}

  ngOnInit() {
    this.tableService.getTables().subscribe(receivedTables => {
      this.tables = receivedTables;
    });

    this.sideTableService.getSideTables().subscribe(receivedSideTables => {
      this.sideTable = receivedSideTables.length > 0 ? receivedSideTables[0] : null;
    });
  }
}
