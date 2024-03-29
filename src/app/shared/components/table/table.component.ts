import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DishComponent } from '../dish/dish.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {DishState} from "../../enums/dish-state";
import {SharedDataService} from "../../../services/shared-data.service";

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
  isSelected: boolean = false;
  shouldDisplayImages: boolean = true;

  constructor(private breakpointObserver: BreakpointObserver, private _sharedDataService: SharedDataService) {}

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isTabletMode = result.matches;
      });

    this.color = this.generateColor(this.id);
    this.shouldDisplayImages = this.dishes.length <= 6;
  }

  handleTableClick() {
    if (this.isTabletMode) {
      console.log('Table clicked in tablet mode');
      this.isDetailedMode = !this.isDetailedMode; // Bascule entre le mode détaillé et normal
      this.tableClick.emit();
    }
  }

  getDisplayedDishes(): DishComponent[] {
    if(this.isTabletMode){
      if(this.isDetailedMode){
        return this.dishes;
      }
      else if(this.sharedDataService.numberOfCooks != 1 ){
        return this.dishes.slice(0, 4);
      }
    }
    return this.dishes;
  }

  generateColor(tableId: number): string {
    const hue = (tableId * 137.508) % 360;
    return `hsl(${hue}, 70%, 70%)`;
  }

  readonly DishState = DishState;

  get sharedDataService(): SharedDataService {
    return this._sharedDataService;
  }

  getFirstStateFromDishes() {
    return this.dishes[0].state;
  }

  isAllStatesGreen(): boolean {
    return this.dishes.every(dish => dish.state === DishState.Done);
  }

  toggleSelection() {
    const numberOfCooks = this.sharedDataService.numberOfCooks;
    const isServeurMode = this.sharedDataService.getServeurMode();

    if (this.isTabletMode && (isServeurMode && this.isAllStatesGreen()) || (numberOfCooks === 1)) {
      this.isSelected = !this.isSelected;
      console.log(`Table ${this.numberTable} sélectionnée: ${this.isSelected}`);
      this.updateSelectedTablesInSharedDataService();
    } else {
      console.log("Sélection de la table non autorisée.");
    }
  }



  private updateSelectedTablesInSharedDataService() {
    const tables = this._sharedDataService.getTables();

    // Vérifie si la table actuelle est déjà sélectionnée
    if (this.isSelected) {
      // Ajoute la table actuelle au Set si elle est sélectionnée
      tables.add(this);
    } else {
      // Supprime la table actuelle du Set si elle n'est plus sélectionnée
      tables.delete(this);
    }

    // Met à jour le Set de tables sélectionnées dans SharedDataService
    this._sharedDataService.setTables(tables);
  }

  numberOfCooks(): number {
    return this._sharedDataService.numberOfCooks;
  }

}
