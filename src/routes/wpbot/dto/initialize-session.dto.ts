import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitializeSessionDto {
  @ApiProperty({
    description: 'Descrição da sessão a ser inicializada',
    example: 'Minha Sessão WhatsApp',
  })
  @IsString()
  description: string;
}
