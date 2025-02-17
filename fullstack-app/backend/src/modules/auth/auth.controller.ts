//auth.controller.ts
import { Controller, Post, Body, UseGuards, Get, Req, HttpException, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response } from 'express';
import { RegisterDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const { email, password, name, contactPhone, role } = registerDto;

      return await this.authService.register({ email, password, name, contactPhone, role });
    } catch (error) {
      throw new HttpException(error.message || 'Ошибка регистрации. Попробуйте позже.', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      return await this.authService.login(body.email, body.password);
    } catch (error) {
      throw new HttpException(error.message || 'Неверные учетные данные.', HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const user = await this.authService.findUserById(req.user.userId);
    
    if (!user) {
      throw new HttpException('Пользователь не найден в базе.', HttpStatus.NOT_FOUND);
    }
    return user;
  }


  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    try {
      res.clearCookie('jwt');
      return { message: 'Вы успешно вышли из системы.' };
    } catch (error) {
      throw new HttpException('Ошибка при выходе.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}