import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitializeSessionDto {
  @ApiProperty({
    description: 'numero da sessão a ser inicializada',
    example: '553391448945',
  })
  @IsString()
  number: string;

  @ApiProperty({
    description: 'Descrição da sessão a ser inicializada',
    example: 'nome do whatsapp "minha empresa" "comercial"',
  })
  @IsString()
  name: string;
}
