import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.phone, dto.password);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.phone, dto.password);
  }
}
