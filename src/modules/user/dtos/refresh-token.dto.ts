import { IsOptional, IsString, IsUUID } from 'class-validator';

export class RefreshTokenDto {
  @IsUUID('4')
  userId!: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;
}
