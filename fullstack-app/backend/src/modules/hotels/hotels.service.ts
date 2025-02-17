//hotels.service.ts
import * as mongoose from 'mongoose';

import { 
  Injectable, 
  ConflictException, 
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { Hotel, HotelDocument } from '../shemas/hotel.schema';
import { Booking, BookingDocument } from '../shemas/booking.schema';

@Injectable()
export class HotelsService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>
  ) {}
  async createHotel(createHotelDto: CreateHotelDto, images: Express.Multer.File[]) {
    // Валидация входящих данных
    console.log('Saving Hotel:', createHotelDto); // Проверяем, сохраняются ли данные
    if (!createHotelDto.name?.trim()) {
      throw new BadRequestException('Название отеля обязательно');
    }

    if (!createHotelDto.description?.trim()) {
      throw new BadRequestException('Описание отеля обязательно');
    }

    const existingHotel = await this.hotelModel.findOne({ 
      name: createHotelDto.name 
    });
    
    if (existingHotel) {
      throw new ConflictException('Отель с таким названием уже существует');
    }

    try {
      // const imagePaths = images.map(img => img.path);
      
      // const newHotel = new this.hotelModel({
      //   ...createHotelDto,
      //   images: imagePaths,
      // });
      const imageNames = images.map(img => img.filename); // Берем только имя файла
      const newHotel = new this.hotelModel({
        ...createHotelDto,
        images: imageNames, // Сохраняем имена файлов
      });

      return await newHotel.save();
    } catch (err) {
      throw new BadRequestException(
        `Ошибка при создании отеля: ${err.message}`
      );
    }
  }

  async findAllHotels(limit: number, offset: number) {
    const hotels = await this.hotelModel.find()
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  
    return hotels;
  }

  async findHotelById(id: string) {
    const hotel = await this.hotelModel.findById(id);
    if (!hotel) {
      throw new BadRequestException('Отель не найден');
    }
    return hotel;
  }

  async updateHotel(id: string, updateData: any) {
    const updateObject: any = {
      description: updateData.description,
      updatedAt: new Date()
    };
  
    if (updateData.name) updateObject.name = updateData.name;
    if (updateData.images) updateObject.$push = { images: { $each: updateData.images } };
  
    const updatedHotel = await this.hotelModel.findByIdAndUpdate(
      id,
      updateObject,
      { new: true }
    );
  
    if (!updatedHotel) {
      throw new BadRequestException('Отель не найден');
    }
  
    return updatedHotel;
  }

  async deleteHotel(id: string) {
    const result = await this.hotelModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new BadRequestException('Отель не найден');
    }
    return { message: 'Отель успешно удален' };
  }

  async findHotelRooms(limit: number, offset: number, hotelId: string) {
    const hotel = await this.findHotelById(hotelId);
    return [];
  }

  async removeImage(id: string, imageName: string) {
    return this.hotelModel.findByIdAndUpdate(
      id,
      { $pull: { images: imageName } },
      { new: true }
    );
  }

  async addRoom(hotelId: string, roomData: any) {
    const hotel = await this.hotelModel.findById(hotelId);
    if (!hotel) {
      throw new BadRequestException('Отель не найден');
    }
  
    const newRoom = {
      _id: new mongoose.Types.ObjectId(), 
      ...roomData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  
    hotel.rooms.push(newRoom);
    await hotel.save();
    
    console.log('Добавлен номер:', newRoom);
    console.log('Обновленный отель:', hotel);
    return newRoom;
  }

  async updateRoom(hotelId: string, roomId: string, updateData: any) {
    const hotel = await this.hotelModel.findById(hotelId);
    if (!hotel) throw new NotFoundException('Отель не найден');
    
    const room = hotel.rooms.find(r => r._id.toString() === roomId);
    if (!room) throw new NotFoundException('Номер не найден');
  
    if (updateData.images) {
      room.images = [...room.images, ...updateData.images];
    }
    
    Object.assign(room, {
      ...updateData,
      updatedAt: new Date()
    });
    
    await hotel.save();
    return room;
  }

  async findRoomById(hotelId: string, roomId: string) {
    const hotel = await this.hotelModel.findById(hotelId);
    if (!hotel) throw new NotFoundException('Отель не найден');
    
    const room = hotel.rooms.find(r => r._id.toString() === roomId);
    if (!room) throw new NotFoundException('Номер не найден');
    
    return room;
  }

  async removeRoomImage(hotelId: string, roomId: string, imageName: string) {
    const hotel = await this.hotelModel.findById(hotelId);
    if (!hotel) throw new NotFoundException('Отель не найден');
    
    const room = hotel.rooms.find(r => r._id.toString() === roomId);
    if (!room) throw new NotFoundException('Номер не найден');
    
    room.images = room.images.filter(img => img !== imageName);
    await hotel.save();
    return room;
  }
  
  async searchAvailableRooms(
    hotelName: string | undefined,
    checkInDate: Date,
    checkOutDate: Date
  ) {
    if (checkInDate > checkOutDate) {
      throw new Error('Дата заезда не может быть позже даты выезда');
    }
  
    const query: any = {};
    if (hotelName && hotelName.trim()) {
      query.name = new RegExp(hotelName.trim(), 'i');
    }
  
    const hotels = await this.hotelModel.find(query).lean().exec();
  
    const overlappingBookings = await this.bookingModel.find({
      $or: [
        {
          checkInDate: { $lt: checkOutDate },
          checkOutDate: { $gt: checkInDate }
        }
      ]
    });
  
    const bookedRoomIds = overlappingBookings.map(b => b.roomId.toString());
  
    const filteredHotels = hotels
      .map(hotel => ({
        ...hotel,
        rooms: (hotel.rooms || [])
          .filter(room => !bookedRoomIds.includes(room._id.toString()))
      }))
      .filter(hotel => hotel.rooms.length > 0);
  
    return { hotels: filteredHotels };
  }
}