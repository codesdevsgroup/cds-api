import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import { Client } from 'whatsapp-web.js';

@Injectable()
export class WpmsgService {
  private readonly logger = new Logger(WpmsgService.name);
  private clients: Map<string, Client> = new Map();

  constructor(private prisma: PrismaService) {}

  // Envia uma mensagem usando a sessão especificada
  async sendMessage(sessionId: string, number: string, message: string) {
    const client = this.clients.get(sessionId);
    if (!client) {
      throw new Error(`Sessão "${sessionId}" não encontrada.`);
    }

    const chatId = `${number}@c.us`;
    await client.sendMessage(chatId, message);
    this.logger.log(
      `Mensagem enviada para ${number} pela sessão "${sessionId}".`,
    );
  }
}
