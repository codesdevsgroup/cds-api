import { Controller, Get, Param } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // Rota para listar todos os usuários
  @Get()
  getUsuarios() {
    return this.usuariosService.getAllUsuarios();
  }

  // Rota para buscar um usuário pelo ID
  @Get(':id')
  getUsuario(@Param('id') id: string) {
    return this.usuariosService.umUsuario(id);
  }
}
