import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WpbotService } from './wpbot.service';

import { PrismaModule } from '../../services/prisma/prisma.module';
import { WpbotController } from './wpbot.controller';

@Module({
  imports: [EventEmitterModule.forRoot(), PrismaModule],
  providers: [WpbotService],
  controllers: [WpbotController],
})
export class WpbotModule {}
