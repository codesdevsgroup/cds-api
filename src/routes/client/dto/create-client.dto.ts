import {
  IsString,
  IsOptional,
  IsEmail,
  MaxLength,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @IsString()
  @MaxLength(80)
  @ApiProperty({
    description: 'Nome da Empresa que é Cliente Final',
    example: 'Empresa XYZ',
    maxLength: 80,
  })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  @ApiProperty({
    description: 'Nome fantasia da Empresa',
    example: 'Fantasia XYZ',
    maxLength: 80,
    required: false,
  })
  fantasyName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(14)
  @ApiProperty({
    description: 'CPF ou CNPJ da Empresa',
    example: '12345678901234',
    maxLength: 14,
    required: false,
  })
  cpfCnpj?: string;

  @IsEmail()
  @MaxLength(80)
  @ApiProperty({
    description: 'Endereço de email válido',
    example: 'empresa@xyz.com',
    maxLength: 80,
  })
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiProperty({
    description: 'Número de telefone principal',
    example: '5531999999999',
    maxLength: 20,
    required: false,
  })
  phone1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiProperty({
    description: 'Número de telefone secundário',
    example: '5531988888888',
    maxLength: 20,
    required: false,
  })
  phone2?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Notas adicionais sobre o cliente',
    example: 'Cliente VIP',
    required: false,
  })
  notes?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Data de criação do cliente',
    example: '2023-01-01T00:00:00Z',
    required: false,
  })
  createdAt?: Date;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Data de atualização do cliente',
    example: '2023-01-01T00:00:00Z',
    required: false,
  })
  updatedAt?: Date;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Data de exclusão do cliente',
    example: '2023-01-01T00:00:00Z',
    required: false,
  })
  deletedAt?: Date;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Indica se o cliente está excluído',
    example: false,
    required: false,
  })
  isDeleted?: boolean;
}
