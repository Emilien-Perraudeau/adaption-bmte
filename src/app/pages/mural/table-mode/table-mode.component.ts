import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {DishService} from "../../../services/dish.service";
import {DishComponent} from "../../../shared/components/dish/dish.component";

@Component({
  selector: 'app-table-mode',
  templateUrl: './table-mode.component.html',
  styleUrls: ['./table-mode.component.css']
})
export class TableModeComponent implements OnInit {
  plats: any[] = [];
  category: string | null = null;


  constructor(private http: HttpClient,
              private router: Router,
              private dishService: DishService) {}

  ngOnInit(): void {
    this.afficherPlats('Pizzas');
  }

  afficherPlats(categorie: string) {
    this.category = categorie;
    this.dishService.getDishes().subscribe(data => {
      this.plats = data.filter(plat => plat.category === categorie);
    });
  }


  modifierPlat(dish : DishComponent) {
    this.dishService.setSelectedDish(dish);
    this.router.navigate(['/modification-mode',dish.category, dish.id]);
  }

  creerNouveauPlat() {
    this.router.navigate(['/modification-mode', this.category]);
  }




}
