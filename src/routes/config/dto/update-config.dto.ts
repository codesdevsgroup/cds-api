import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateConfigDto {
  @ApiProperty({
    description: 'Nome da configuração',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Endereço de e-mail',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Número de celular',
    example: '5511999999999',
  })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiProperty({
    description: 'Telefone residencial ou comercial',
    example: '551132132132',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone1?: string;

  @ApiProperty({
    description: 'Telefone alternativo',
    example: '551132132133',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone2?: string;

  @ApiProperty({
    description: 'Endereço do local',
    example: 'Rua Exemplo',
  })
  @IsOptional()
  @IsString()
  place?: string;

  @ApiProperty({
    description: 'Número do local',
    example: '123',
  })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiProperty({
    description: 'Complemento do endereço',
    example: 'Apto 101',
    required: false,
  })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty({
    description: 'Bairro',
    example: 'Centro',
  })
  @IsOptional()
  @IsString()
  neighborhood?: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'São Paulo',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'Estado (UF)',
    example: 'SP',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    description: 'Código postal',
    example: '12345678',
  })
  @IsOptional()
  @IsString()
  zipCode?: string;
}
