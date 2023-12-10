import {Component, Input, OnInit} from '@angular/core';
import {DishState} from "../../enums/dish-state";
import {SharedDataService} from "../../../services/shared-data.service";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
  selector: 'app-dish',
  templateUrl: './dish.component.html',
  styleUrls: ['./dish.component.css']
})
export class DishComponent implements OnInit {
  @Input() id!: number;
  @Input() name!: string;
  @Input() image!: string;
  @Input() quantity!: number;
  @Input() category!: string;
  @Input() customerSpecification?: string[];
  @Input() state!: DishState;
  @Input() ingredients!: string[];
  @Input() recipeExpert!: string[];
  @Input() recipeNovice!: string[];
  @Input() isExpanded!: boolean;
  @Input() color!:string;

  isTabletMode:boolean = false;
  isSelected: boolean = false;

  constructor(private sharedDataService: SharedDataService, private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isTabletMode = result.matches;
      });
  }

  getColor(): string {
    switch (this.state) {
      case DishState.NotAssigned:
        return 'red';
      case DishState.InProgress:
        return 'orange';
      case DishState.Done:
        return 'green';
      default:
        return 'white';
    }
  }

  getRecipeNovice(){
    return this.recipeNovice;
  }

  checkboxChanged() {
    this.isSelected = !this.isSelected;

    if (this.isSelected) {
      this.sharedDataService.selectDish(this);
    } else {
      this.sharedDataService.deselectDish(this);
    }

    console.log(`Plat ${this.name} sélectionné: ${this.isSelected}`);
  }
}
