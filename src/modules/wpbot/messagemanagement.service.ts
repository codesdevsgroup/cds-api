import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import { WpMessageStatus } from '@prisma/client';
import {Client} from "whatsapp-web.js";

@Injectable()
export class MessageManagementService {
  private readonly logger = new Logger(MessageManagementService.name);

  constructor(private prisma: PrismaService) {}

  // Atualização do banco de dados para deletar a sessão
  async updateMessageStatus(messageId: string, status: WpMessageStatus) {
    try {
      const message = await this.prisma.wpMessage.findUnique({
        where: { messageId },
      });

      if (!message) {
        this.logger.warn(
          `Mensagem com ID ${messageId} não encontrada no banco de dados.`,
        );
        return; // Ignore if the message is not found
      }

      const updatedMessage = await this.prisma.wpMessage.update({
        where: { messageId },
        data: { status },
      });

      return updatedMessage;
    } catch (error) {
      this.logger.error(
        `Erro ao atualizar status da mensagem ID ${messageId}: ${error.message}`,
      );
      throw new Error(`Erro ao atualizar status da mensagem: ${error.message}`);
    }
  }

  async sendMessage(
    session_id: string,
    number: string,
    message: string,
    client: Client | undefined,
    prisma: PrismaService,
  ) {
    if (!client) {
      throw new Error(`Sessão "${session_id}" não encontrada.`);
    }

    const chatId = `${String(number)}@c.us`; // Forçar o número como string
    this.logger.log(`Enviando mensagem para ${chatId}: "${message}"`);

    try {
      const sentMessage = await client.sendMessage(chatId, message);
      this.logger.log(
        `Mensagem enviada para ${number} pela sessão "${session_id}".`,
      );

      const cleanNumber = (id: string) => id.replace('@c.us', '');

      const wpNumber = await prisma.wpNumber.upsert({
        where: { number: cleanNumber(sentMessage.to) },
        update: {
          wpSessions: cleanNumber(sentMessage.from), // Atualiza a sessão com o número limpo de 'from'
        },
        create: {
          number: cleanNumber(sentMessage.to),
          wpSessions: cleanNumber(sentMessage.from), // Cria o número com a sessão limpa
        },
      });
      const wpMessage = await prisma.wpMessage.create({
        data: {
          messageId: sentMessage.id._serialized, // Salvando o messageId único
          content: message,
          wpSession: {
            connect: { number: session_id },
          },
          status: 'SENT',
          direction: 'SENT',
          timestamp: new Date(sentMessage.timestamp * 1000),
          isAutomated: false,
          wpNumber: {
            connect: { id: wpNumber.id },
          },
        },
      });

      this.logger.log(`Mensagem salva no banco de dados: ID ${wpMessage.id}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar mensagem: ${error.message}`);
      throw error; // Re-throws the error after logging it
    }
  }
}
