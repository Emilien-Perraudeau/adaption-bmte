import { Injectable, OnModuleInit } from '@nestjs/common';
import { TableDto } from '../dto/table.dto';
import { HttpService } from '@nestjs/axios';
import { request } from 'http';

@Injectable()
export class TableService implements OnModuleInit {
  constructor(private httpService: HttpService) {}

  onModuleInit() {
    console.log('onModuleInit');
    this.addTableToBackend();
  }

  async getTables(): Promise<TableDto[]> {
    console.log('getTables');
    this.httpService
      .get('http://localhost:3002/preparations?state=preparationStarted')
      .subscribe((response) => {
        console.log(response.data);
      });

    return [];
  }

  async addTable(nouvelleTable: TableDto): Promise<TableDto> {
    // Logique pour ajouter une nouvelle table

    console.log(nouvelleTable);
    return nouvelleTable;
  }

  async deleteTable(tableId: number) {
    // Logique pour supprimer une table

    console.log(tableId);
  }

  async addTableToBackend(): Promise<void> {
    // Envoyer table au nouveau backend
    const tablesResponse = await this.httpService
      .get('http://localhost:3001/tables')
      .toPromise();
    const availableTables = tablesResponse.data.filter((table) => !table.taken);

    const menusResponse = await this.httpService
      .get('http://localhost:3000/menus')
      .toPromise();
    const numberOfMenusToSelect = Math.floor(Math.random() * 5) + 1; // Choisir un nombre aléatoire entre 1 et 5
    const shuffledMenus = menusResponse.data
      .filter((item) => item.category != 'BEVERAGE')
      .sort(() => 0.5 - Math.random()); // Mélanger le tableau
    const selectedMenus = shuffledMenus.slice(0, numberOfMenusToSelect);

    const table = availableTables[0];

    const orderRequestBody = {
      tableNumber: table.number,
      customersCount: selectedMenus.length,
    };
    console.log('Request body:', orderRequestBody);

    const order = await this.httpService
      .post('http://localhost:3001/tableOrders', orderRequestBody)
      .toPromise();

    console.log('Order:', order.data);

    // Préparer le corps de la requête
    if (order) {
      for (const item of selectedMenus) {
        const preparationRequestBody = {
          menuItemId: item._id,
          menuItemShortName: item.shortName,
          howMany: 1, // Choisir un nombre aléatoire entre 1 et 3
        };
        console.log('Request body:', preparationRequestBody);
        console.log('orderID', order.data._id);
        // Envoyer la requête au backend
        try {
          const orderResponse = await this.httpService
            .post(
              'http://localhost:3001/tableOrders/' + order.data._id,
              preparationRequestBody,
            )
            .toPromise();
          console.log('Order response:', orderResponse.data);
          const preparationResponse = await this.httpService
            .post(
              'http://localhost:3001/tableOrders/' +
                order.data._id +
                '/prepare',
            )
            .toPromise();
          console.log('Preparation response:', preparationResponse.data);
        } catch (e) {
          console.log(e.response.data);
        }
      }
    } else {
      console.log('No available tables.');
    }
  }
}
