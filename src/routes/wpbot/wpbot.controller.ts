import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { IsPublic } from '../../shared/decorators/is-public.decorator';
import { WpbotService } from './wpbot.service';
import { ApiTags } from '@nestjs/swagger';
import { InitializeSessionDto } from './dto/initialize-session.dto';
import { DeleteSessionDto } from './dto/delete-session.dto';
import { SendMessageDto } from './dto/send-message.dto';

@ApiTags('wpbot')
@IsPublic()
@Controller('wpbot')
export class WpbotController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly wpbotService: WpbotService, // Mantém a injeção do serviço WpbotService
  ) {}

  // Inicializa uma nova sessão do WhatsApp
  @Post('initialize')
  initializeSession(
    @Body() initializeSessionDto: InitializeSessionDto,
    @Res() response: Response,
  ) {
    const { sessionId, description } = initializeSessionDto;
    if (!description) {
      return response
        .status(400)
        .send('Descrição é obrigatória para inicializar a sessão.');
    }

    try {
      this.wpbotService.initializeSession({ sessionId, description });
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
    const qrCode = this.wpbotService.getQrCode(sessionId);
    if (!qrCode) {
      return response
        .status(404)
        .send('QR code não encontrado para esta sessão.');
    }

    try {
      response.setHeader('Content-Type', 'text/plain');
      return response.send(qrCode);
    } catch (error) {
      return response.status(500).send('Falha ao gerar QR code');
    }
  }

  // Lista todas as sessões ativas
  @Get('active-sessions')
  async getActiveSessions(@Res() response: Response) {
    const activeSessions = await this.wpbotService.getActiveSessions();
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

  @Post('send-message')
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto, // Alterado para receber o body completo
    @Res() response: Response,
  ) {
    const { sessionId, number, message } = sendMessageDto; // Obtenha o sessionId do corpo da requisição
    try {
      await this.wpbotService.sendMessage(sessionId, number, message);
      return response.status(200).send('Mensagem enviada com sucesso!');
    } catch (error) {
      return response
        .status(500)
        .send(
          `Falha ao enviar mensagem na sessão "${sessionId}": ${error.message}`,
        );
    }
  }
}
