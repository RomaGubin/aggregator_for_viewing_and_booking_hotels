// users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll(offset: number, limit: number, filters: { name?: string; email?: string; contactPhone?: string }) {
    const query = this.userModel.find();

    if (filters.name) query.where('name').regex(new RegExp(filters.name, 'i'));
    if (filters.email) query.where('email').regex(new RegExp(filters.email, 'i'));
    if (filters.contactPhone) query.where('contactPhone').regex(new RegExp(filters.contactPhone, 'i'));

    const totalCount = await this.userModel.countDocuments(query);
    const users = await query.skip(offset).limit(limit).exec();

    return { users, totalCount };
  }

  async register(registerDto: { email: string; password: string; name: string; role: string; contactPhone: string }) {
    const existingUser = await this.userModel.findOne({ email: registerDto.email });
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = new this.userModel({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      role: registerDto.role,
      contactPhone: registerDto.contactPhone,
    });

    await user.save();
    return user;
  }

  async deleteByEmail(email: string): Promise<void> {
    const result = await this.userModel.deleteOne({ email });
    if (result.deletedCount === 0) {
      throw new Error('Пользователь с таким email не найден');
    }
    console.log(`Пользователь с email ${email} был удалён.`);
  }
}
