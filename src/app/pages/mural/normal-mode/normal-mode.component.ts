import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TableService } from "../../../services/table.service";
import { TableComponent } from "../../../shared/components/table/table.component";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {DishService} from "../../../services/dish.service";

@Component({
  selector: 'app-normal-mode',
  templateUrl: './normal-mode.component.html',
  styleUrls: ['./normal-mode.component.css']
})
export class NormalModeComponent implements OnInit {
  tables: TableComponent[] = [];
  isTabletMode = false;

  constructor(
    private tableService: TableService,
    private dishService: DishService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.tableService.getTables().subscribe(receivedTables => {
      this.tables = receivedTables;
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
    return sommeTotale > 10;
  }

  getSommeDishComponentByTable(table: TableComponent): number {
    return table.dishes.length;
  }


  onValidate() {
    this.router.navigate(['/preparation-mode']);
  }

  onRushMode(){
    this.router.navigate(['/rush-mode'])
  }

  ajouterNouvelleTable() {
    // Générer une nouvelle table
    const nouvelleTable = {
      id: Math.random(),
      numberTable: 1,
      numberOrder: 202,
      dishes: [
        {
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
    });

    if (this.checkIfRushMode()) this.router.navigate(['/rush-mode']);
  }


}
