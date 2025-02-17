// hotels.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingsService } from '../hotels/bookings.service';
import { HotelsService } from './hotels.service';
import { SearchHotelRoomsDto } from './dto/search-hotel-rooms.dto';
import { multerConfig } from './multer.config';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { User } from '../users/user.entity';
import { parseISO } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';

@Controller('hotels')
export class HotelsController {
  constructor(
    private readonly hotelsService: HotelsService,
    private readonly bookingsService: BookingsService,
  ) {}
  

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig))
  async createHotel(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() body: { name: string; description: string },
  ) {
    try {
      if (!body.name || !body.description) {
        throw new HttpException('Все поля обязательны', HttpStatus.BAD_REQUEST);
      }
      const createHotelDto: CreateHotelDto = {
        name: body.name,
        description: body.description,
        images: images.map((img) => img.filename),
      };
      console.log('Файлы, полученные сервером:', images);
      console.log('Данные отеля:', createHotelDto);
      return await this.hotelsService.createHotel(createHotelDto, images);
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAllHotels(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    return this.hotelsService.findAllHotels(limit, offset);
  }

  @Get('search/rooms')
  async searchAvailableRooms(
    @Query('hotelName') hotelName: string,
    @Query('checkInDate') checkInDate: string,
    @Query('checkOutDate') checkOutDate: string,
  ) {
    try {
      // Проверка формата дат
      if (isNaN(new Date(checkInDate).getTime()) || isNaN(new Date(checkOutDate).getTime())) {
        throw new Error('Неверный формат дат');
      }

      const result = await this.hotelsService.searchAvailableRooms(
        hotelName,
        new Date(checkInDate),
        new Date(checkOutDate)
      );

      if (result.hotels.length === 0) {
        return { message: 'На выбранные даты нет свободных отелей' };
      }
      return result;
    } catch (error) {
      return { message: error.message };
    }
  }

  @Get(':id/rooms')
  async findHotelRooms(
    @Param('id') hotelId: string,
    @Query() searchHotelRoomsDto: SearchHotelRoomsDto,
  ) {
    return this.hotelsService.findHotelRooms(
      searchHotelRoomsDto.limit,
      searchHotelRoomsDto.offset,
      hotelId,
    );
  }
  @Post(':id/rooms')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig))
  async addRoom(
    @Param('id') hotelId: string,
    @UploadedFiles() images: Express.Multer.File[],
    @Body() body: { name: string; description: string; price: string }
  ) {
    try {

      if (!body.name || !body.description || !body.price) {
        throw new HttpException('Не заполнены обязательные поля', HttpStatus.BAD_REQUEST);
      }  

      const createRoomDto = {
        name: body.name,
        description: body.description,
        price: Number(body.price),
        images: images?.map(img => img.filename) || [],
      };
      
      const hotel = await this.hotelsService.addRoom(hotelId, createRoomDto);
    
      const newRoom = hotel.rooms[hotel.rooms.length - 1];
      return { 
        ...newRoom.toObject(),
        id: newRoom._id.toString() 
      };
      
    } catch (error) {
      console.error('Ошибка создания номера:', error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  
  @Put(':hotelId/rooms/:roomId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig))
  async updateRoom(
    @Param('hotelId') hotelId: string,
    @Param('roomId') roomId: string,
    @UploadedFiles() images: Express.Multer.File[],
    @Body() body: any
  ) {
    
    const updateData = {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      images: images?.map(img => img.filename)
    };
    
    return this.hotelsService.updateRoom(hotelId, roomId, updateData);
  }

  // @Post(':hotelId/rooms/:roomId/book')
  // @UseGuards(JwtAuthGuard)
  // async bookRoom(
  //   @Req() req: Request & { user: User },
  //   @Param('hotelId') hotelId: string,
  //   @Param('roomId') roomId: string,
  //   @Body() createBookingDto: CreateBookingDto
  // ) {
  //   return this.bookingsService.createBooking(
  //     req.user, // Передаем пользователя из запроса
  //     {
  //       ...createBookingDto,
  //       hotelId,
  //       roomId
  //     }
  //   );
  // }


  @Get(':hotelId/rooms/:roomId')
  async getRoomById(
    @Param('hotelId') hotelId: string,
    @Param('roomId') roomId: string
  ) {
    return this.hotelsService.findRoomById(hotelId, roomId);
  }
  @Delete(':hotelId/rooms/:roomId/images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteRoomImage(
    @Param('hotelId') hotelId: string,
    @Param('roomId') roomId: string,
    @Body() body: { imageName: string },
  ) {
    try {
      const filePath = path.join(process.cwd(), 'uploads', body.imageName);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        throw new Error('Файл не найден');
      }

      return this.hotelsService.removeRoomImage(hotelId, roomId, body.imageName);
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id/images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteImage(
    @Param('id') id: string,
    @Body() body: { imageName: string },
  ) {
    try {
      const filePath = path.join(process.cwd(), 'uploads', body.imageName);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        throw new Error('Файл не найден');
      }

      return this.hotelsService.removeImage(id, body.imageName);
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findHotelById(@Param('id') id: string) {
    try {
      return this.hotelsService.findHotelById(id);
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig))
  async updateHotel(
    @Param('id') id: string,
    @UploadedFiles() images: Express.Multer.File[],
    @Body() body: { name: string; description: string }
  ) {
    try {
      const updateData = {
        name: body.name,
        description: body.description,
        ...(images?.length > 0 && { 
          images: images.map(img => img.filename) 
        })
      };
      
      return this.hotelsService.updateHotel(id, updateData);
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteHotel(@Param('id') id: string) {
    try {
      return this.hotelsService.deleteHotel(id);
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}