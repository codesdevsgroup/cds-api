import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Client, LocalAuth } from 'whatsapp-web.js';
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
  private qrCodes: { [sessionId: string]: string } = {}; // Armazena os QR Codes por sessão

  constructor(
    private eventEmitter: EventEmitter2,
    private prisma: PrismaService,
  ) {}

  // Chamado quando o módulo é inicializado
  onModuleInit() {
    this.logger.log('WpbotService inicializado.');
    this.loadSessions(); // Carrega sessões do arquivo
  }

  // Salva detalhes da sessão no banco de dados
  private async saveSessionToDb(
    sessionId: string,
    description: string,
    dataPath: string,
  ) {
    if (!description) {
      throw new Error('Description is required');
    }

    await this.prisma.wpSession.upsert({
      where: { sessionId },
      update: { description, dataPath },
      create: { sessionId, description, dataPath },
    });
  }

  // Deleta detalhes da sessão do banco de dados
  private async deleteSessionFromDb(sessionId: string) {
    await this.prisma.wpSession.delete({
      where: { sessionId },
    });
  }

  // Salva IDs de sessão em um arquivo
  private saveSessions() {
    const sessionIds = Array.from(this.clients.keys());
    fs.writeFileSync(this.sessionsFile, JSON.stringify(sessionIds));
  }

  // Carrega IDs de sessão de um arquivo e inicializa-as
  private async loadSessions() {
    const sessions = await this.prisma.wpSession.findMany();
    sessions.forEach((session) => {
      this.initializeSession({
        sessionId: session.sessionId,
        description: session.description,
      });
    });
  }

  // Inicializa uma nova sessão do WhatsApp com o ID e descrição fornecidos
  initializeSession({
    sessionId,
    description,
  }: {
    sessionId: string;
    description: string;
  }) {
    if (this.clients.has(sessionId)) {
      this.logger.warn(`Sessão "${sessionId}" já está inicializada.`);
      return;
    }

    const dataPath = `./auth/${sessionId}`;
    const client = new Client({
      authStrategy: new LocalAuth({
        dataPath,
      }),
    });

    // Evento para geração de QR code
    client.on('qr', async (qr) => {
      this.logger.log(`QR Code gerado para a sessão "${sessionId}".`);
      const base64QrCode = await QRCode.toDataURL(qr);
      this.qrCodes[sessionId] = base64QrCode;
      this.eventEmitter.emit(`qrcode.created.${sessionId}`, base64QrCode);
      qrcodeTerminal.generate(qr, { small: true });
    });

    // Evento para conexão bem-sucedida
    client.on('ready', () => {
      this.logger.log(`Sessão "${sessionId}" conectada com sucesso!`);
    });

    // Evento para recebimento de mensagens
    client.on('message', (message) => {
      this.logger.log(
        `Mensagem recebida na sessão "${sessionId}": ${message.body}`,
      );
    });

    // Evento para desconexão
    client.on('disconnected', () => {
      this.logger.warn(`Sessão "${sessionId}" foi desconectada.`);
      this.clients.delete(sessionId);
      this.saveSessions();
      this.deleteSessionFromDb(sessionId);
      delete this.qrCodes[sessionId]; // Remove o QR code quando a sessão é desconectada
    });

    client.initialize();
    this.clients.set(sessionId, client);
    this.saveSessions();
    this.saveSessionToDb(sessionId, description, dataPath);
  }

  // Retorna todas as sessões ativas com descrição
  async getActiveSessions(): Promise<
    { sessionId: string; description: string }[]
  > {
    const sessions = await this.prisma.wpSession.findMany();
    return sessions.map((session) => ({
      sessionId: session.sessionId,
      description: session.description,
    }));
  }

  // Deleta uma sessão do WhatsApp com o ID fornecido
  async deleteSession(sessionId: string) {
    const client = this.clients.get(sessionId);
    if (!client) {
      throw new Error(`Sessão "${sessionId}" não encontrada.`);
    }

    client.destroy();
    this.clients.delete(sessionId);
    this.saveSessions();
    await this.deleteSessionFromDb(sessionId);
    delete this.qrCodes[sessionId]; // Remove o QR code quando a sessão é deletada

    const sessionPath = path.join('./auth', sessionId);
    if (fs.existsSync(sessionPath)) {
      try {
        await this.retryDeleteFile(sessionPath);
      } catch (error) {
        if (error.code === 'EBUSY') {
          this.logger.warn(
            `Recurso ocupado ou bloqueado ao deletar a sessão "${sessionId}": ${error.message}`,
          );
        } else {
          this.logger.error(
            `Erro ao deletar a sessão "${sessionId}": ${error.message}`,
          );
          throw error;
        }
      }
    }

    this.logger.log(`Sessão "${sessionId}" deletada com sucesso.`);
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
  getQrCode(sessionId: string): string {
    return this.qrCodes[sessionId];
  }
}
