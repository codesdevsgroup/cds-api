import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient, Usuarios } from '@prisma/client';

@Injectable()
export class AuthService {
  private prisma = new PrismaClient();

  async login(email: string, password: string): Promise<Usuarios> {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { email },
    });
    if (!usuario || usuario.password !== password) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return usuario;
  }
}
