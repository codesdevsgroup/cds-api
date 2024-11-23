import { Module } from '@nestjs/common';
import { WpmsgService } from './wpmsg.service';
import { WpmsgController } from './wpmsg.controller';
import { PrismaService } from '../../services/prisma/prisma.service';
import { WpbotModule } from '../wpbot/wpbot.module';

@Module({
  imports: [WpbotModule],
  controllers: [WpmsgController],
  providers: [WpmsgService, WpmsgService, PrismaService],
})
export class WpmsgModule {}
