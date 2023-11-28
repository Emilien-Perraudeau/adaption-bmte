import { Component, OnInit } from '@angular/core';
import {TableComponent} from "../../../shared/components/table/table.component";

@Component({
  selector: 'app-normal-mode',
  templateUrl: './normal-mode.component.html',
  styleUrls: ['./normal-mode.component.css']
})
export class NormalModeComponent {
  tables: TableComponent[] = [
    {
      numberTable: 1,
      numberOrder: 101,
      dishes: [
        { name: 'Plat 1', image: './assets/lasagne.jpg', quantity: 2, customerSpecification: [`Supplément A`] },
        { name: 'Plat 2', image: './assets/lasagne.jpg', quantity: 1, customerSpecification: [] }
      ]
    },
  ];

}
