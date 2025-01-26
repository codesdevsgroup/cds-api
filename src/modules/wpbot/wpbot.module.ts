import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WpbotService } from './wpbot.service';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { WpbotController } from './wpbot.controller';
import { SessionManagementService } from './sessionmanagement.service';
import { MessageManagementService } from './messagemanagement.service';
import { QrCodeGenerationService } from './qrcodegeneration.service';

@Module({
  imports: [EventEmitterModule.forRoot(), PrismaModule],
  providers: [
    WpbotService,
    SessionManagementService,
    MessageManagementService,
    QrCodeGenerationService,
  ],
  controllers: [WpbotController],
  exports: [
    WpbotService,
    SessionManagementService,
    MessageManagementService,
    QrCodeGenerationService,
  ],
})
export class WpbotModule {}
