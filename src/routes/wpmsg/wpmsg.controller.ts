import { Controller, Post, Body, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { WpmsgService } from './wpmsg.service';
import { WpbotService } from '../wpbot/wpbot.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('wpmsg')
export class WpmsgController {
  constructor(
    private wpmsgService: WpmsgService,
    private wpbotService: WpbotService,
  ) {}

  // Envia uma mensagem usando uma sessão específica
  @Post('send/:sessionId')
  async sendMessage(
    @Param('sessionId') sessionId: string,
    @Body() sendMessageDto: SendMessageDto,
    @Res() response: Response,
  ) {
    const { number, message } = sendMessageDto;
    try {
      await this.wpmsgService.sendMessage(
        sessionId,
        number,
        message,
        this.wpbotService.getClients(),
      );
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
