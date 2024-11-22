import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Client, LocalAuth } from 'whatsapp-web.js';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private client: Client;
  private readonly logger = new Logger(WhatsappService.name);

  constructor(private eventEmitter: EventEmitter2) {
    this.client = new Client({
      authStrategy: new LocalAuth(),
    });
  }

  onModuleInit() {
    this.client.on('qr', (qr) => {
      this.logger.log(`QrCode: http://localhost:3006/whatsapp/qrcode`);
      this.eventEmitter.emit('qrcode.created', qr);
    });

    this.client.on('ready', () => {
      this.logger.log("You're connected successfully!");
    });

    this.client.initialize();
  }

  async sendMessage(number: string, message: string) {
    const chatId = `${number}@c.us`;
    await this.client.sendMessage(chatId, message);
  }
}
