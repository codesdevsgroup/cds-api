import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { BotController } from './whatsapp.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [WhatsappService],
  controllers: [BotController],
})
export class WhatsappModule {}
