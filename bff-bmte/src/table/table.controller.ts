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
import { EventsGateway } from '../websocket.gateway';

@Controller('tables')
export class TableController {
  constructor(
    private readonly tableService: TableService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Get()
  async getTables(): Promise<TableDto[]> {
    // Logique pour récupérer les tables
    return this.tableService.getTables();
  }

  @Post()
  async addTable(@Body() nouvelleTable: TableDto): Promise<TableDto> {
    const addedTable = await this.tableService.addTable(nouvelleTable);
    this.eventsGateway.sendTableUpdate(addedTable);
    return addedTable;
  }

  @Delete(':tableId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTable(@Param('tableId') tableId: number) {
    await this.tableService.deleteTable(tableId);
    this.eventsGateway.sendTableUpdate({ id: tableId }); // Envoyer l'événement via WebSocket
  }

  // La méthode updateTablesAfterAddition semble redondante avec getTables.
  // Si son comportement est différent, implémentez la logique correspondante. Sinon, vous pouvez réutiliser getTables().
}
