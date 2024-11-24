import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({
    description: 'ID da sessão do WhatsApp',
    example: '553391448945',
  })
  @IsString()
  number: string;

  @ApiProperty({
    description: 'Número de telefone para enviar a mensagem',
    example: '553391448945',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'Conteúdo da mensagem a ser enviada',
    example: 'Olá, esta é uma mensagem de teste!',
  })
  @IsString()
  message: string;
}
