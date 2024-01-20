// menu-item.dto.ts
export class MenuItemDTO {
  fullName: string;
  shortName?: string; // Supposons que shortName est un champ facultatif
  price: number;
  category: string;
  image: string;
}
