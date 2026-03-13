import { IsString, MaxLength } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  @MaxLength(160)
  name!: string;

  @IsString()
  @MaxLength(120)
  type!: string;
}
