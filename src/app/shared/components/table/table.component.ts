import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DishComponent } from '../dish/dish.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
  isDetailedMode = false; // Ajout de la propriété pour suivre le mode détaillé

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isTabletMode = result.matches;
      });

    this.color = this.generateColor(this.id);
  }

  handleTableClick() {
    if (this.isTabletMode) {
      console.log('Table clicked in tablet mode');
      this.isDetailedMode = !this.isDetailedMode; // Bascule entre le mode détaillé et normal
      this.tableClick.emit();
    }
  }

  getDisplayedDishes(): DishComponent[] {
    // Retourne tous les plats si la table est en mode détaillé
    //return this.isTabletMode && this.isDetailedMode ? this.dishes : this.dishes.slice(0, 4);
    if(this.isTabletMode){
      if(this.isDetailedMode){
        return this.dishes;
      }
      else{
        return this.dishes.slice(0, 4);
      }
    }
    return this.dishes;
  }

  generateColor(tableId: number): string {
    const hue = (tableId * 137.508) % 360;
    return `hsl(${hue}, 70%, 70%)`;
  }
}
