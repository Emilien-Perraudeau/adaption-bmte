import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
}) // Vous pouvez spécifier un port et des options si nécessaire
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  sendTableUpdate(data: any) {
    this.server.emit('tableUpdated', data); // 'tableUpdated' est le nom de l'événement
  }
}
