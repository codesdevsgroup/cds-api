import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LogInterceptor } from './interceptors/log.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SocketIoAdapter } from './socket-io.adapter';
import * as cors from 'cors';
import './logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    cors({
      origin: ['https://codesdevs.com.br', 'http://localhost:4200'],
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'enctype'],
      credentials: true,
      optionsSuccessStatus: 200, // For legacy browser support
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new LogInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Documentação com Swagger - CodesDevs')
    .setDescription(
      'O Swagger (aka OpenApi) é uma biblioteca muito conhecida no universo backend.',
    )
    .setVersion('1.0')
    .addTag('user')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Configurar o adaptador do Socket.IO
  app.useWebSocketAdapter(new SocketIoAdapter(app));

  await app.listen(3006);
}

bootstrap();
