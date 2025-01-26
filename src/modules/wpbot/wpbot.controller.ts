import { Controller, Get, Post, Body, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IsPublic } from '../../decorators/is-public.decorator';
import { WpbotService } from './wpbot.service';
import { ApiTags } from '@nestjs/swagger';
import { InitializeSessionDto } from './dto/initialize-session.dto';
import { DeleteSessionDto } from './dto/delete-session.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { SessionManagementService } from './sessionmanagement.service';

@ApiTags('wpbot')
@IsPublic()
@Controller('wpbot')
export class WpbotController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly wpbotService: WpbotService, // Mantém a injeção do serviço WpbotService
    private readonly sessionManagementService: SessionManagementService, // Inject SessionManagementService
  ) {}

  // Inicializa uma nova sessão do WhatsApp
  @Post('initialize')
  initializeSession(
    @Body() initializeSessionDto: InitializeSessionDto,
    @Res() response: Response,
  ) {
    const { number, name } = initializeSessionDto;
    if (!name) {
      return response
        .status(400)
        .send('Name is required to initialize the session.');
    }

    try {
      this.wpbotService.initializeSession({ number, name });
      return response
        .status(200)
        .send(
          `Sessão "${number}" inicializada. Escaneie o QR Code para conectar.`,
        );
    } catch (error) {
      return response
        .status(500)
        .send(`Error initializing session "${number}": ${error.message}`);
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
      await this.sessionManagementService.deleteSession(sessionId); // Await the async method
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
    @Body() sendMessageDto: SendMessageDto,
    @Res() response: Response,
  ) {
    const { number, phoneNumber, message } = sendMessageDto;
    try {
      await this.wpbotService.sendMessage(number, phoneNumber, message);
      return response.status(200).send('Mensagem enviada com sucesso!');
    } catch (error) {
      return response
        .status(500)
        .send(
          `Falha ao enviar mensagem na sessão "${number}": ${error.message}`,
        );
    }
  }
}
