import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DishComponent } from '../dish/dish.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {Time} from "@angular/common";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() id!: number;
  @Input() numberTable!: number;
  @Input() numberOrder!: number;
  @Input() dishes!: DishComponent[];
  @Input() time!: Date;
  @Input() simpleView: boolean = false;
  @Output() tableClick = new EventEmitter<void>();
  color!: string;
  isTabletMode = false;


  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isTabletMode = result.matches;
      });

    this.color = this.generateColor(this.numberTable);
  }

  handleTableClick() {
    if (this.isTabletMode) {
      console.log('Table clicked in tablet mode');
      this.tableClick.emit();
    }
  }

  getDisplayedDishes(): DishComponent[] {
    // Seulement les 4 premiers plats en mode tablette
    return this.isTabletMode ? this.dishes.slice(0, 4) : this.dishes;
  }

  private generateColor(tableId: number): string {
    const hue = (tableId * 137.508) % 360;
    return `hsl(${hue}, 70%, 70%)`;
  }
}
