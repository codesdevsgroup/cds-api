import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WpbotService } from '../wpbot/wpbot.service'; // Importando o serviço WPBot

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private wpbotService: WpbotService) {}

  // Evento de conexão
  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  // Evento de desconexão
  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  // Evento para receber a mensagem e repassar ao WpbotService
  @SubscribeMessage('sendMessage')
  async handleMessage(
      @MessageBody() data: { sessionId: string; number: string; message: string },
      @ConnectedSocket() client: Socket,
  ) {
    const { sessionId, number, message } = data;

    try {
      // Chama o serviço do WhatsApp para enviar a mensagem
      await this.wpbotService.sendMessage(sessionId, number, message);

      // Emite de volta ao cliente confirmando o envio da mensagem
      client.emit('messageSent', {
        success: true,
        message: 'Mensagem enviada com sucesso!',
      });
    } catch (error) {
      console.error(error);
      client.emit('messageSent', {
        success: false,
        message: 'Erro ao enviar mensagem.',
      });
    }
  }
}
