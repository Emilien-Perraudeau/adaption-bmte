export class TableDto {
  id: number;
  numberTable: number;
  numberOrder: string;
  time: string;
  dishes: DishDto[]; // Vous devrez également définir un DTO pour les plats
}

export class IngredientDto {
  name: string;
  image: string;
}

export class DishDto {
  id: number;
  tableId: number;
  name: string;
  category: string;
  image: string;
  quantity: number;
  customerSpecification: string[];
  state: string;
  ingredients: IngredientDto[];
  recipe: string[];
}
