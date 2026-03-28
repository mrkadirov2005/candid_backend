import { IsEnum, IsUUID } from 'class-validator';
import { MessageStatus } from '../models/message.model';

export class SetMessageStatusDto {
  @IsUUID('4')
  id!: string;

  @IsEnum(MessageStatus)
  status!: MessageStatus;
}
