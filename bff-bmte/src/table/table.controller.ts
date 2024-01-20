import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TableService } from './table.service';
import { TableDto } from '../dto/table.dto';

@Controller('tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Get()
  async getTables(): Promise<TableDto[]> {
    // Logique pour récupérer les tables
    return this.tableService.getTables();
  }

  @Post()
  async addTable(@Body() nouvelleTable: TableDto): Promise<TableDto> {
    // Logique pour ajouter une nouvelle table
    return this.tableService.addTable(nouvelleTable);
  }

  @Delete(':tableId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTable(@Param('tableId') tableId: number) {
    // Logique pour supprimer une table
    return this.tableService.deleteTable(tableId);
  }

  // La méthode updateTablesAfterAddition semble redondante avec getTables.
  // Si son comportement est différent, implémentez la logique correspondante. Sinon, vous pouvez réutiliser getTables().
}
