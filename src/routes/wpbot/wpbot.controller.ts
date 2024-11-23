import { Controller, Get, Post, Body, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { IsPublic } from '../../shared/decorators/is-public.decorator';
import * as QRCode from 'qrcode';
import { WpbotService } from './wpbot.service';
import { ApiTags } from '@nestjs/swagger';
import { InitializeSessionDto } from './dto/initialize-session.dto';
import { SendMessageDto } from '../wpmsg/dto/send-message.dto';
import { DeleteSessionDto } from './dto/delete-session.dto';

@ApiTags('wpbot')
@IsPublic()
@Controller('wpbot')
export class WpbotController {
  private qrCodes: { [sessionId: string]: string } = {}; // Armazena os QR Codes por sessão

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly wpbotService: WpbotService, // Mantém a injeção do serviço WpbotService
  ) {}

  // Evento para capturar o QR Code gerado por uma sessão específica
  @OnEvent('qrcode.created')
  handleQrcodeCreatedEvent(data: { sessionId: string; qrCode: string }) {
    const { sessionId, qrCode } = data;
    this.qrCodes[sessionId] = qrCode; // Armazena o QR Code da sessão
  }

  // Inicializa uma nova sessão do WhatsApp
  @Post('initialize/:sessionId')
  initializeSession(
    @Param('sessionId') sessionId: string,
    @Body() initializeSessionDto: InitializeSessionDto,
    @Res() response: Response,
  ) {
    const { description } = initializeSessionDto;
    if (!description) {
      return response
        .status(400)
        .send('Descrição é obrigatória para inicializar a sessão.');
    }

    try {
      this.wpbotService.initializeSession(sessionId, description);
      return response
        .status(200)
        .send(
          `Sessão "${sessionId}" inicializada. Escaneie o QR Code para conectar.`,
        );
    } catch (error) {
      return response
        .status(500)
        .send(`Erro ao inicializar a sessão "${sessionId}": ${error.message}`);
    }
  }

  // Obtém o QR Code da sessão especificada
  @Get('qrcode/:sessionId')
  async getQrCode(
    @Param('sessionId') sessionId: string,
    @Res() response: Response,
  ) {
    const qrCode = this.qrCodes[sessionId];
    if (!qrCode) {
      return response
        .status(404)
        .send('QR code não encontrado para esta sessão.');
    }

    try {
      const base64QrCode = await QRCode.toDataURL(qrCode);
      response.setHeader('Content-Type', 'text/plain');
      return response.send(base64QrCode);
    } catch (error) {
      return response.status(500).send('Falha ao gerar QR code');
    }
  }

  // Lista todas as sessões ativas
  @Get('active-sessions')
  getActiveSessions(@Res() response: Response) {
    const activeSessions = this.wpbotService.getActiveSessions();
    return response.status(200).send(activeSessions);
  }

  // Adiciona a rota para deletar uma sessão
  @Post('delete')
  async deleteSession(
    @Body() deleteSessionDto: DeleteSessionDto,
    @Res() response: Response,
  ) {
    const { sessionId } = deleteSessionDto;
    try {
      this.wpbotService.deleteSession(sessionId);
      return response
        .status(200)
        .send(`Sessão "${sessionId}" deletada com sucesso.`);
    } catch (error) {
      return response
        .status(500)
        .send(`Erro ao deletar a sessão "${sessionId}": ${error.message}`);
    }
  }
}
