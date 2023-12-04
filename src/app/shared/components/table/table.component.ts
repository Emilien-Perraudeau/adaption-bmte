import {Component, Input, OnInit} from '@angular/core';
import {DishComponent} from "../dish/dish.component";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  @Input() numberTable!: number;
  @Input() numberOrder!: number;
  @Input() dishes!: DishComponent[];
  @Input() date!: Date;

}
