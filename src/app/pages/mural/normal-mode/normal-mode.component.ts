import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TableService } from "../../../services/table.service";
import { TableComponent } from "../../../shared/components/table/table.component";

@Component({
  selector: 'app-normal-mode',
  templateUrl: './normal-mode.component.html',
  styleUrls: ['./normal-mode.component.css']
})
export class NormalModeComponent implements OnInit {
  tables: TableComponent[] = [];
  isTabletMode = false;

  constructor(
    private tableService: TableService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.tableService.getTables().subscribe(receivedTables => {
      this.tables = receivedTables;
    });

    // Detect changes in screen size to determine tablet mode
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isTabletMode = result.matches;
      });
  }
}
