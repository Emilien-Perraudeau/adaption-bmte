import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DishComponent } from '../dish/dish.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() numberTable!: number;
  @Input() numberOrder!: number;
  @Input() dishes!: DishComponent[];
  @Input() date!: Date;
  @Input() simpleView: boolean = false;

  @Output() tableClick = new EventEmitter<void>();

  isTabletMode = false;


  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    // Détectez les changements de taille d'écran pour déterminer le mode tablette
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isTabletMode = result.matches;
      });
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
}
