import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @IsString()
  @MaxLength(80)
  @ApiProperty({
    description: 'Nome da Empresa que é Cliente Final',
    type: String,
    maxLength: 80,
    required: true,
  })
  name: string;

  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  notes: string;
}
