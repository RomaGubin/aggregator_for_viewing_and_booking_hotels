//auth.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: { email: string, password: string, name: string, contactPhone:string , role: string }) {
    const existingUser = await this.userModel.findOne({ email: registerDto.email });
    if (existingUser) {
      throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = new this.userModel({ 
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      contactPhone: registerDto.contactPhone,
      role: registerDto.role
    });
    return user.save();
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Неверные учетные данные', HttpStatus.UNAUTHORIZED);
    }

    const payload = { email: user.email, sub: user._id, role: user.role };
    const token = this.jwtService.sign(payload);
    return { token };
  }
}