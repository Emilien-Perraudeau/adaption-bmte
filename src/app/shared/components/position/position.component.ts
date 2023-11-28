import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent {
  @Input() numberOfPosition!: number;
  @Input() name!: string;
}
