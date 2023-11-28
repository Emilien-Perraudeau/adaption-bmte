import {Component, Input, OnInit} from '@angular/core';
import {DishComponent} from "../dish/dish.component";

@Component({
  selector: 'app-side-table',
  templateUrl: './side-table.component.html',
  styleUrls: ['./side-table.component.css']
})
export class SideTableComponent {
  @Input() numberTable!: number;
  @Input() numberOrder!: number;
  @Input() numberOfOrders!: number;
}
