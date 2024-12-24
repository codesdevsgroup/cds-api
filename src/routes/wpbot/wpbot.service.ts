import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../services/prisma/prisma.service';
import { SessionManagementService } from './sessionmanagement.service';
import { MessageManagementService } from './messagemanagement.service';
import { QrCodeGenerationService } from './qrcodegeneration.service';

@Injectable()
export class WpbotService {
  constructor(
    private eventEmitter: EventEmitter2,
    private prisma: PrismaService,
    private readonly sessionManagementService: SessionManagementService,
    private readonly messageManagementService: MessageManagementService,
    private readonly qrCodeGenerationService: QrCodeGenerationService,
  ) {}

  // Delega a inicialização da sessão
  initializeSession({ number, name }: { number: string; name: string }) {
    this.sessionManagementService.initializeSession({ number, name });
  }

  async getActiveSessions() {
    return await this.sessionManagementService.getActiveSessions();
  }

  getQrCode(number: string) {
    return this.sessionManagementService.getQrCode(number);
  }

  getClient(number: string) {
    return this.sessionManagementService.getClient(number);
  }

  async sendMessage(session_id: string, number: string, message: string) {
    const client = this.sessionManagementService.getClient(session_id);
    await this.messageManagementService.sendMessage(
      session_id,
      number,
      message,
      client,
      this.prisma,
    );
  }
}
