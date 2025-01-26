import { IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  number: string;

  @IsString()
  message: string;

  @IsString()
  sessionId: string;
}
