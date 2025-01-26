import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { WpbotModule } from '../wpbot/wpbot.module';

@Module({
  imports: [PrismaModule, WpbotModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
