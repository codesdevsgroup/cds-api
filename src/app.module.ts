import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PrismaModule } from './services/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsuariosModule, PrismaModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
