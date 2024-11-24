import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcodeTerminal from 'qrcode-terminal';
import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../../services/prisma/prisma.service';
import { WpMessageStatus } from '@prisma/client';

@Injectable()
export class WpbotService implements OnModuleInit {
  private readonly logger = new Logger(WpbotService.name);
  private clients: Map<string, Client> = new Map(); // Armazena múltiplos clientes
  private readonly sessionsFile = './auth/sessions.json'; // Arquivo para armazenar IDs de sessão
  private qrCodes: { [number: string]: string } = {}; // Armazena os QR Codes por sessão

  constructor(
    private eventEmitter: EventEmitter2,
    private prisma: PrismaService,
  ) {}

  // Chamado quando o módulo é inicializado
  onModuleInit() {
    this.logger.log('WpbotService inicializado.');
    this.loadSessions(); // Carrega sessões do banco de dados
  }

  // Salva detalhes da sessão no banco de dados
  private async saveSessionToDb(
    number: string,
    name: string,
    dataPath: string,
  ) {
    if (!name) {
      throw new Error('Name is required');
    }

    await this.prisma.wpSession.upsert({
      where: { number },
      update: { name, sessionData: dataPath },
      create: { number, name, sessionData: dataPath, status: 'PENDING' },
    });
  }

  // Salva IDs de sessão em um arquivo
  private saveSessions() {
    const sessionIds = Array.from(this.clients.keys());
    fs.writeFileSync(this.sessionsFile, JSON.stringify(sessionIds));
  }

  // Carrega IDs de sessão do banco de dados e inicializa-as
  private async loadSessions() {
    const sessions = await this.prisma.wpSession.findMany();
    sessions.forEach((session) => {
      this.initializeSession({
        number: session.number,
        name: session.name,
      });
    });
  }

  // Inicializa uma nova sessão do WhatsApp com o número e nome fornecidos
  initializeSession({ number, name }: { number: string; name: string }) {
    if (this.clients.has(number)) {
      this.logger.warn(`Sessão "${number}" já está inicializada.`);
      return;
    }

    const dataPath = `./auth/${number}`;
    const client = new Client({
      authStrategy: new LocalAuth({
        dataPath,
      }),
    });

    client.on('qr', async (qr) => {
      this.qrCodes[number] = qr;
      qrcodeTerminal.generate(qr, { small: true });
      this.logger.log(`QR Code gerado para a sessão "${number}".`);

      // Armazena o QR Code em base64
      this.qrCodes[number] = await QRCode.toDataURL(qr);
    });

    client.on('ready', () => {
      this.logger.log(`Sessão "${number}" está pronta.`);
      this.prisma.wpSession.update({
        where: { number },
        data: { status: 'CONNECTED' },
      });
    });

    client.on('authenticated', () => {
      this.logger.log(`Sessão "${number}" autenticada com sucesso.`);
      this.prisma.wpSession.update({
        where: { number },
        data: { status: 'CONNECTED' },
      });
    });

    client.on('auth_failure', (msg) => {
      this.logger.error(`Falha na autenticação da sessão "${number}": ${msg}`);
      this.prisma.wpSession.update({
        where: { number },
        data: { status: 'DISCONNECTED' },
      });
    });

    client.on('disconnected', (reason) => {
      this.logger.warn(`Sessão "${number}" desconectada: ${reason}`);
      this.prisma.wpSession.update({
        where: { number },
        data: { status: 'DISCONNECTED' },
      });
      this.clients.delete(number);
    });

    client.on('message_ack', async (message, ack) => {
      const messageId = message.id._serialized; // ou message.id
      let status: WpMessageStatus;

      switch (ack) {
        case 1:
          status = 'SENT'; // Mensagem enviada ao servidor
          break;
        case 2:
          status = 'DELIVERED'; // Mensagem entregue ao destinatário
          break;
        case 3:
          status = 'READ'; // Mensagem lida
          break;
        case 0:
          status = 'FAILED'; // Falha ao enviar
          break;
        default:
          status = 'SENT'; // Caso o ack seja outro
          break;
      }

      try {
        // Atualize o status no banco de dados
        await this.updateMessageStatus(messageId, status);
        this.logger.log(
          `Status da mensagem ID ${messageId} atualizado para ${status}.`,
        );
      } catch (error) {
        this.logger.error(
          `Erro ao atualizar status da mensagem ID ${messageId}: ${error.message}`,
        );
      }
    });

    client.initialize();
    this.clients.set(number, client);
    this.saveSessions();
    this.saveSessionToDb(number, name, dataPath);
  }

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

  // Retorna todas as sessões ativas com nome
  async getActiveSessions(): Promise<{ number: string; name: string }[]> {
    const sessions = await this.prisma.wpSession.findMany();
    return sessions.map((session) => ({
      number: session.number,
      name: session.name,
    }));
  }

  async deleteSession(number: string): Promise<void> {
    this.logger.log(`Tentando deletar a sessão "${number}".`);

    const client = this.clients.get(number);
    if (!client) {
      this.logger.warn(
        `Tentativa de deletar a sessão "${number}", mas o cliente já foi removido. Clientes disponíveis: ${Array.from(this.clients.keys()).join(', ')}`,
      );
      return; // Retorna silenciosamente, já que a sessão não existe mais
    }

    try {
      // 1. Destruir o cliente e remover da memória
      await client.destroy();
      this.clients.delete(number);
      this.saveSessions();
      await this.deleteSessionFromDb(number);
      delete this.qrCodes[number];

      // 2. Remover diretório de dados de sessão
      const sessionPath = path.resolve('./auth', number); // Caminho absoluto para evitar problemas
      if (fs.existsSync(sessionPath)) {
        await this.retryDeleteFile(sessionPath);
      } else {
        this.logger.warn(`Caminho da sessão "${sessionPath}" não encontrado.`);
      }

      this.logger.log(`Sessão "${number}" deletada com sucesso.`);
    } catch (error) {
      this.logger.error(
        `Erro ao deletar a sessão "${number}": ${error.message}`,
      );
      throw error; // Relançar o erro após log
    }
  }

  private async retryDeleteFile(
    filePath: string,
    retries: number = 3,
    delay: number = 1000,
  ): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await fs.promises.rm(filePath, { recursive: true, force: true });
        this.logger.log(`Diretório "${filePath}" deletado com sucesso.`);
        return;
      } catch (error) {
        if (error.code === 'EBUSY' && attempt < retries) {
          this.logger.warn(
            `Tentativa ${attempt} falhou ao deletar "${filePath}". Recurso ocupado. Tentando novamente em ${delay}ms.`,
          );
          await this.delay(delay);
        } else {
          this.logger.error(
            `Erro ao deletar "${filePath}" na tentativa ${attempt}: ${error.message}`,
          );
          throw error;
        }
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Atualização do banco de dados para deletar a sessão
  private async deleteSessionFromDb(number: string): Promise<void> {
    try {
      await this.prisma.wpSession.delete({
        where: { number },
      });
      this.logger.log(`Sessão "${number}" removida do banco de dados.`);
    } catch (error) {
      this.logger.error(
        `Erro ao remover sessão "${number}" do banco: ${error.message}`,
      );
      throw error;
    }
  }

  // Obtém o QR Code em base64 para uma sessão especificada
  getQrCode(number: string): string {
    return this.qrCodes[number];
  }

  getClient(number: string): Client | undefined {
    return this.clients.get(number);
  }

  // Envia uma mensagem para um número de telefone em uma sessão específica
  async sendMessage(session_id: string, number: string, message: string) {
    const client = this.clients.get(session_id);
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

      const wpNumber = await this.prisma.wpNumber.upsert({
        where: { number: cleanNumber(sentMessage.to) },
        update: {
          wpSessions: cleanNumber(sentMessage.from), // Atualiza a sessão com o número limpo de 'from'
        },
        create: {
          number: cleanNumber(sentMessage.to),
          wpSessions: cleanNumber(sentMessage.from), // Cria o número com a sessão limpa
        },
      });
      const wpMessage = await this.prisma.wpMessage.create({
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
