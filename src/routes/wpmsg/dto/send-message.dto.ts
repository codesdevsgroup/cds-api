import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({
    description: 'Número de telefone para enviar a mensagem',
    example: '5511999999999',
  })
  @IsString()
  number: string;

  @ApiProperty({
    description: 'Conteúdo da mensagem a ser enviada',
    example: 'Olá, esta é uma mensagem de teste!',
  })
  @IsString()
  message: string;
}
