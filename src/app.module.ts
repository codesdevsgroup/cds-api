import { Module } from '@nestjs/common';
import { PrismaModule } from './services/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { EmailModule } from './services/email/email.module';
import { GoogleAuthModule } from './modules/google-auth/google-auth.module';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './services/email/email.processor';
import { EmailService } from './services/email/email.service';
import { ConfigModule } from './modules/config/config.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WpbotModule } from './modules/wpbot/wpbot.module';
import { ChatModule } from './modules/chat/chat.module';
import { ChatService } from './modules/chat/chat.service';

@Module({
  imports: [
    EmailModule,
    PrismaModule,
    UserModule,
    AuthModule,
    EmailModule,
    GoogleAuthModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
    ConfigModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    WpbotModule,
    ChatModule,
  ],
  providers: [
    EmailProcessor,
    EmailService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    ChatService,
  ],
})
export class AppModule {}
