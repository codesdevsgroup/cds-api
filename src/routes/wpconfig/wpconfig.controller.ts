import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { IsPublic } from '../../shared/decorators/is-public.decorator';
import * as QRCode from 'qrcode';
import { WpconfigService } from './wpconfig.service';

@IsPublic()
@Controller('wpconfig')
export class BotController {
  private qrCode: string;

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly wpconfigService: WpconfigService,
  ) {}

  @OnEvent('qrcode.created')
  handleQrcodeCreatedEvent(qrCode: string) {
    this.qrCode = qrCode;
  }

  @Get('qrcode')
  async getQrCode(@Res() response: Response) {
    if (!this.qrCode) {
      return response.status(404).send('QR code not found');
    }

    response.setHeader('Content-Type', 'image/png');
    QRCode.toFileStream(response, this.qrCode);
  }

  @Post('send')
  async sendMessage(
    @Body() body: { number: string; message: string },
    @Res() response: Response,
  ) {
    try {
      await this.wpconfigService.sendMessage(body.number, body.message);
      return response.status(200).send('Message sent successfully');
    } catch (error) {
      return response.status(500).send('Failed to send message');
    }
  }
}
