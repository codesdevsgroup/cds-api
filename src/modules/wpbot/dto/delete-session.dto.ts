import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteSessionDto {
  @ApiProperty({
    description: 'ID da sessão a ser deletada',
    example: 'session123',
  })
  @IsString()
  sessionId: string;
}
