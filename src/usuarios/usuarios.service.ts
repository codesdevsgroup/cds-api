import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Usuarios } from '@prisma/client';

@Injectable()
export class UsuariosService {
  private prisma = new PrismaClient();

  async getAllUsuarios(): Promise<Usuarios[]> {
    return this.prisma.usuarios.findMany();
  }

  async umUsuario(usuarioId: string): Promise<Usuarios> {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { usuarioId },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${usuarioId} não encontrado`);
    }
    return usuario;
  }
}