// menu.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { MenuItemDTO } from '../dto/menu-item.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MenuService implements OnModuleInit {
  constructor(private httpService: HttpService) {}

  async onModuleInit() {
    // const uniqueDishes = this.getUniqueExistingDishes();
    //await this.addMenuItems(uniqueDishes);
  }

  async addMenuItems(dishes: any[]): Promise<void> {
    for (const dish of dishes) {
      const menuItem: MenuItemDTO = {
        fullName: dish.name,
        shortName: dish.name,
        price: this.calculatePrice(dish),
        category: 'STARTER',
        image: 'https://' + dish.image,
      };

      console.log(menuItem);

      // Envoyer menuItem au nouveau backend
      await lastValueFrom(
        this.httpService.post('http://localhost:3000/menus', menuItem),
      );
    }
  }

  private calculatePrice(dish: any): number {
    // Implémentez votre logique pour calculer le prix d'un plat
    return dish.name.length; // Mettre une valeur par défaut pour l'exemple
  }

  private getUniqueExistingDishes(): any[] {
    const filePath = path.join(__dirname, '../../../src/assets/db.json'); // Mettez le chemin correct de votre fichier JSON
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(jsonData);
    const dishes = data.tables.flatMap((table) => table.dishes); // Récupère tous les plats de chaque table

    const uniqueDishesMap = new Map();

    dishes.forEach((dish) => {
      // Utiliser le nom du plat comme clé unique. Vous pouvez aussi ajouter d'autres attributs si nécessaire
      if (!uniqueDishesMap.has(dish.name)) {
        uniqueDishesMap.set(dish.name, dish);
      }
    });

    // Convertir la Map en tableau
    return Array.from(uniqueDishesMap.values());
  }
}
