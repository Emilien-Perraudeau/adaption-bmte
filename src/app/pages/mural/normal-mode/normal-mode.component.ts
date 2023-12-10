import {Component, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {TableService} from "../../../services/table.service";
import {TableComponent} from "../../../shared/components/table/table.component";
import {Router} from "@angular/router";
import {SharedDataService} from "../../../services/shared-data.service";
import {forkJoin, Observable} from "rxjs";
import {DishState} from "../../../shared/enums/dish-state";
import {DishComponent} from "../../../shared/components/dish/dish.component";
import {HttpClient} from "@angular/common/http";
import {DishService} from "../../../services/dish.service";
import {TimelineComponent} from "../../../shared/components/timeline/timeline.component";

@Component({
  selector: 'app-normal-mode',
  templateUrl: './normal-mode.component.html',
  styleUrls: ['./normal-mode.component.css']
})
export class NormalModeComponent implements OnInit {
  tables: TableComponent[] = [];
  isTabletMode = false;
  timeline: { time: Date, color: string }[] = [];

  constructor(
    private tableService: TableService,
    private dishService: DishService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private sharedDataService: SharedDataService,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.tableService.getTables().subscribe(receivedTables => {
      receivedTables.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
      this.tables = receivedTables;
      console.log(this.tables)
      this.tables.forEach(table => {
        this.timeline.push({ time: new Date(table.time), color: this.generateColor(table.id) });
        console.log("timeline "+ table.color)
      });
    });

    // Detect changes in screen size to determine tablet mode
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isTabletMode = result.matches;
      });

    if (this.checkIfRushMode()) this.router.navigate(['/rush-mode'])

  }

  checkIfRushMode() {
    const sommeTotale: number = this.tables.reduce((somme, table) => somme + this.getSommeDishComponentByTable(table), 0);
    return sommeTotale > 10 && this.sharedDataService.numberOfCooks > 1;
  }

  getSommeDishComponentByTable(table: TableComponent): number {
    return table.dishes.length;
  }


  onPreparationMode() {
    this.dishService.getTables().subscribe(tables => {
      const selectedDishes = this.sharedDataService.getSelectedDishes();
      const tablesToUpdate = tables.filter(table => {
        let tableNeedsUpdate = false;
        table.dishes.forEach(dish => {
          const isSelected = selectedDishes.some(selectedDish => {
            return selectedDish.id === dish.id;
          });
          if (isSelected && dish.state === DishState.NotAssigned) {
            dish.state = DishState.InProgress;
            tableNeedsUpdate = true;
          }
        });
        return tableNeedsUpdate;
      });


      console.log('Tables to Update:', tablesToUpdate.length);
      if (tablesToUpdate.length > 0) {

        const updateRequests = tablesToUpdate.map(table => this.dishService.updateTable(table));
        forkJoin(updateRequests).subscribe(results => {
          console.log('All tables updated:', results);
          this.router.navigate(['/preparation-mode']);
        });
      } else {
        this.router.navigate(['/preparation-mode']);
      }
    });
  }


  onRushMode() {
    this.router.navigate(['/rush-mode'])
  }

  ajouterNouvelleTable() {
    const id = Math.random();
    // Générer une nouvelle table
    const nouvelleTable = {
      id: id,
      time: "2023-12-06T16:00:00.000Z",
      numberTable: 1,
      numberOrder: 202,
      dishes: [
        {
          "id": Math.random(),
          "tableId": id,
          name: "Poulet Rôti",
          category: "Grill",
          image: "assets/images/poulet_roti.jpg",
          quantity: 1,
          ingredients: [
            "ingredient1",
            "ingredient2"
          ],
          customerSpecification: [
            "Sans peau",
            "Extra sauce"
          ],
          state: "DONE",
          recipeExpert: [
            "Étape Expert 1 pour Poulet Rôti",
            "Étape Expert 2 pour Poulet Rôti"
          ],
          recipeNovice: [
            "Étape Novice 1 pour Poulet Rôti",
            "Étape Novice 2 pour Poulet Rôti"
          ]
        },
      ]
    };

    this.tableService.addTable(nouvelleTable).subscribe(response => {
      console.log('Nouvelle table ajoutée avec succès :', response);

      this.tableService.updateTablesAfterAddition().subscribe((tables: TableComponent[]) => {
        this.tables = tables;
      });

      this.tables.forEach(table => {
        this.timeline.push({ time: new Date(table.time), color: table.color });
      });
    });


    if (this.checkIfRushMode()) this.router.navigate(['/rush-mode']);
  }


  isAnyDishSelected(): boolean {
    return this.sharedDataService.getSelectedDishes().length > 0;
  }

  resetDishesState() {
    this.dishService.getTables().subscribe(tables => {
      tables.forEach(table => {
        let tableNeedsUpdate = false;

        table.dishes.forEach(dish => {
          if (dish.state !== DishState.NotAssigned) {
            dish.state = DishState.NotAssigned;
            tableNeedsUpdate = true;
          }
        });

        if (tableNeedsUpdate) {
          this.dishService.updateTable(table).subscribe(updatedTable => {
            console.log('Table updated after reset:', updatedTable);
          });
        }
      });
    });
  }

  generateColor(tableId: number): string {
    const hue = (tableId * 137.508) % 360;
    return `hsl(${hue}, 70%, 70%)`;
  }

  numberOfCooks(): number {
    return this.sharedDataService.numberOfCooks;
  }
}
