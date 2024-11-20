import { Module } from '@nestjs/common';
import { PrismaModule } from './services/prisma/prisma.module';
import { UserModule } from './routes/user/user.module';
import { AuthModule } from './routes/auth/auth.module';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { EmailModule } from './services/email/email.module';
import { GoogleAuthModule } from './routes/google-auth/google-auth.module';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './services/email/email.processor';
import { EmailService } from './services/email/email.service';
import { ConfigModule } from './routes/config/config.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ClientModule } from './routes/client/client.module';

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
    ClientModule,
  ],
  providers: [
    EmailProcessor,
    EmailService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [],
})
export class AppModule {}
