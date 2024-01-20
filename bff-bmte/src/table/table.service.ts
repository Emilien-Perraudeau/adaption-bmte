import { Injectable, OnModuleInit } from '@nestjs/common';
import { TableDto, DishDto } from '../dto/table.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TableService implements OnModuleInit {
  constructor(private httpService: HttpService) {}

  onModuleInit() {
    console.log('onModuleInit');
    //this.addTableToBackend();
    this.getTables();
  }

  async getTables(): Promise<TableDto[]> {
    console.log('getTables');
    const preparationResponse = await this.httpService
      .get<
        PreparationResponse[]
      >('http://localhost:3002/preparations?state=preparationStarted')
      .toPromise();
    console.log('preparationResponse', preparationResponse.data);

    // Étape 1: Regrouper les préparations par tableNumber
    const preparationsByTableNumber: { [key: number]: PreparationGroup } =
      preparationResponse.data.reduce((acc, preparation) => {
        if (!acc[preparation.tableNumber]) {
          acc[preparation.tableNumber] = {
            tableNumber: preparation.tableNumber,
            time: preparation.shouldBeReadyAt,
            preparations: [],
          };
        }
        acc[preparation.tableNumber].preparations.push(preparation);
        return acc;
      }, {});

    // Étape 2: Créer un TableDto pour chaque groupe de préparations
    const tableDtos = await Promise.all(
      Object.values(preparationsByTableNumber).map(
        async (group: PreparationGroup) => {
          const dishes = await Promise.all(
            group.preparations.flatMap((preparation) =>
              preparation.preparedItems.map(async (preparedItem) => {
                const menuItem = await this.fetchMenuItem(
                  preparedItem.shortName,
                ); // Assurez-vous que cette fonction existe et fonctionne correctement
                if (menuItem) {
                  const dishDto: DishDto = {
                    id: preparedItem._id,
                    tableId: group.tableNumber,
                    name: menuItem.shortName,
                    category: menuItem.category,
                    image: menuItem.image,
                    quantity: preparedItem.quantity || 1,
                    customerSpecification:
                      preparedItem.customerSpecification || [],
                    state: preparedItem.state || 'NOT_ASSIGNED',
                    ingredients: [], // À déterminer comment remplir
                    recipe: [], // À déterminer comment remplir
                  };
                  return dishDto;
                } else {
                  return null;
                }
              }),
            ),
          );

          const tableDto: TableDto = {
            id: group.tableNumber, // Vous devrez peut-être ajuster cette partie
            numberTable: group.tableNumber,
            numberOrder: group.tableNumber, // Vous devrez peut-être ajuster cette partie
            time: group.time, // Vous devrez peut-être ajuster cette partie pour refléter la bonne heure
            dishes: dishes.filter((dish) => dish !== null),
          };
          return tableDto;
        },
      ),
    );

    console.log('Table DTOs:', tableDtos);
    return tableDtos;
  }

  async fetchMenuItem(menuShortName: string): Promise<any> {
    try {
      console.log('fetchMenuItem');
      console.log('menuShortName', menuShortName);
      const menuItemResponse = await this.httpService
        .get('http://localhost:3000/menus')
        .toPromise();
      const menuItem = menuItemResponse.data.find(
        (item) => item.shortName === menuShortName,
      );

      if (!menuItem) {
        console.log('No menu item found');
      } else {
        console.log('menuItem', menuItem);
        return menuItem;
      }
    } catch (e) {
      console.log(e.response.data);
    }
  }

  async addTable(nouvelleTable: TableDto): Promise<TableDto> {
    // Logique pour ajouter une nouvelle table

    console.log(nouvelleTable);
    this.addTableToBackend();
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

interface PreparationResponse {
  _id: string;
  tableNumber: number;
  shouldBeReadyAt: string;
  completedAt: string | null;
  takenForServiceAt: string | null;
  preparedItems: any[]; // Remplacez any[] par le type approprié si vous en avez un
}

interface PreparationGroup {
  tableNumber: number;
  time: string;
  preparations: PreparationResponse[];
}
