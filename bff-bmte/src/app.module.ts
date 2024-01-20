import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { MenuService } from './menu/menu.service';
import { TableService } from './table/table.service';
import { TableController } from './table/table.controller';
import { EventsGateway } from './websocket.gateway';

@Module({
  imports: [HttpModule],
  controllers: [AppController, TableController],
  providers: [AppService, MenuService, TableService, EventsGateway],
})
export class AppModule {}
