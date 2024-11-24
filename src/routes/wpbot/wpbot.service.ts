import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import * as qrcodeTerminal from 'qrcode-terminal';
import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../../services/prisma/prisma.service';

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
      create: { number, name, sessionData: dataPath, status: 'active' }, // Add the required status property
    });
  }

  // Deleta detalhes da sessão do banco de dados
  private async deleteSessionFromDb(number: string) {
    await this.prisma.wpSession.delete({
      where: { number },
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

    client.on('qr', (qr) => {
      this.qrCodes[number] = qr;
      qrcodeTerminal.generate(qr, { small: true });
      this.logger.log(`QR Code gerado para a sessão "${number}".`);
    });

    client.initialize();
    this.clients.set(number, client);
    this.saveSessions();
    this.saveSessionToDb(number, name, dataPath);
  }

  // Retorna todas as sessões ativas com nome
  async getActiveSessions(): Promise<{ number: string; name: string }[]> {
    const sessions = await this.prisma.wpSession.findMany();
    return sessions.map((session) => ({
      number: session.number,
      name: session.name,
    }));
  }

  // Deleta uma sessão do WhatsApp com o número fornecido
  async deleteSession(number: string) {
    const client = this.clients.get(number);
    if (!client) {
      throw new Error(`Sessão "${number}" não encontrada.`);
    }

    client.destroy();
    this.clients.delete(number);
    this.saveSessions();
    await this.deleteSessionFromDb(number);
    delete this.qrCodes[number]; // Remove o QR code quando a sessão é deletada

    const sessionPath = path.join('./auth', number);
    if (fs.existsSync(sessionPath)) {
      try {
        await this.retryDeleteFile(sessionPath);
      } catch (error) {
        if (error.code === 'EBUSY') {
          this.logger.warn(
            `Recurso ocupado ou bloqueado ao deletar a sessão "${number}": ${error.message}`,
          );
        } else {
          this.logger.error(
            `Erro ao deletar a sessão "${number}": ${error.message}`,
          );
          throw error;
        }
      }
    }

    this.logger.log(`Sessão "${number}" deletada com sucesso.`);
  }

  private async retryDeleteFile(
    filePath: string,
    retries: number = 3,
    delay: number = 1000,
  ): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        fs.rmSync(filePath, { recursive: true, force: true });
        return;
      } catch (error) {
        if (error.code === 'EBUSY' && attempt < retries) {
          await this.delay(delay);
        } else {
          throw error;
        }
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

    // Verifique se o número foi corretamente formatado
    const chatId = `${String(number)}@c.us`; // Forçar o número como string
    this.logger.log(`Enviando mensagem para ${chatId}: "${message}"`);

    try {
      const sentMessage = await client.sendMessage(chatId, message);
      this.logger.log(`Mensagem enviada para ${number} pela sessão "${session_id}".`);

      // Log detalhado da mensagem enviada (sem usar console.log)
      this.logger.debug(`Mensagem enviada detalhes:`);
      this.logger.debug(`De: ${sentMessage.from}`);
      this.logger.debug(`Para: ${sentMessage.to}`);
      this.logger.debug(`ID da mensagem: ${sentMessage.id._serialized}`);
      this.logger.debug(`Timestamp: ${sentMessage.timestamp}`);
      this.logger.debug(`Tipo de mensagem: ${sentMessage.type}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar mensagem: ${error.message}`);
      throw error; // Re-throws the error after logging it
    }
  }
}
