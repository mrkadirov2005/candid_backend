import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsUUID('4')
  senderId!: string;

  @IsUUID('4')
  receiverId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  message!: string;
}
