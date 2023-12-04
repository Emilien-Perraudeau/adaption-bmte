import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dish',
  templateUrl: './dish.component.html',
  styleUrls: ['./dish.component.css']
})
export class DishComponent {
  @Input() name!: string;
  @Input() image!: string;
  @Input() quantity!: number;
  @Input() customerSpecification?: string[];
  @Input() category!: string;
}
