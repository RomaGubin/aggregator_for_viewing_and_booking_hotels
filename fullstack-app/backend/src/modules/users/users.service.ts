// users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll(offset: number, limit: number, search?: string) {
    try {
      const query: any = {};
      
      if (search?.trim()) {
        const searchTerm = search.trim();
        const searchConditions = [];
        
        searchConditions.push(
          { name: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } }
        );
  
        if (/^[0-9+]+$/.test(searchTerm)) {
          searchConditions.push(
            { contactPhone: { $regex: searchTerm, $options: 'i' } }
          );
        }
  
        if (mongoose.Types.ObjectId.isValid(searchTerm)) {
          searchConditions.push({ 
            _id: new mongoose.Types.ObjectId(searchTerm) 
          });
        }
  
        query.$or = searchConditions;
      }
  
      const [users, totalCount] = await Promise.all([
        this.userModel.find(query)
          .skip(offset)
          .limit(limit)
          .select('_id name email contactPhone role')
          .lean()
          .exec(),
          
        this.userModel.countDocuments(query)
      ]);
  
      return { users, totalCount };
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Ошибка при выполнении запроса');
    }
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

  async findUserById(id: string): Promise<User> {
    return this.userModel.findById(id).select('-password').exec();
  }
}