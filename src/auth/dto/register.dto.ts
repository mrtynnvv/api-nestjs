import { IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Matches(/^[\d+\-\s()]+$/)
  phone: string;

  @IsString()
  @MinLength(8)
  password: string;
}
