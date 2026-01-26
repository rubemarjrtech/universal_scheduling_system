import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: (requestOrigin, callback) => {
      const whitelist = process.env.SOCKET_ORIGIN;
      if (!requestOrigin || whitelist.includes(requestOrigin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
  },
})
export class LockGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`New client: ${client.id} just connected `);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client: ${client.id} disconnected `);
  }

  notifySlotLock(date: string) {
    this.server.emit('lock', date);
  }
}
