import { Module } from '@nestjs/common';
import { WpconfigService } from './wpconfig.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BotController } from './wpconfig.controller';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [WpconfigService],
  controllers: [BotController],
})
export class WpconfigModule {}
