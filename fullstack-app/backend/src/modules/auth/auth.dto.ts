//auth.dto.ts
import { IsEmail, IsString, IsOptional, IsPhoneNumber, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsString()
  role: string;

  @IsOptional()

  contactPhone?: string;
}
