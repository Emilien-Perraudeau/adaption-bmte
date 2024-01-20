export class TableDto {
  readonly id?: number;
  readonly numberTable: number;
  readonly numberOrder: number;
  readonly time: string;
  readonly dishes: []; // Vous devrez également définir un DTO pour les plats
}
