//bookings.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from '../shemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { User } from '../users/user.entity';
import * as mongoose from 'mongoose';


@Injectable()
export class BookingsService {
  constructor(@InjectModel(Booking.name) private bookingModel: Model<BookingDocument>) {}

  async getBookingsByUserId(userId: string) {
    return this.bookingModel.find({ userId })
      .populate('hotelId', 'name')
      .populate('roomId', 'name')
      .exec();
  }

  async createBooking(userId: string, createBookingDto: CreateBookingDto) {
    const checkIn = new Date(createBookingDto.checkInDate);
    const checkOut = new Date(createBookingDto.checkOutDate);
  
    if (checkIn >= checkOut) {
      throw new BadRequestException('Дата заезда должна быть раньше даты выезда');
    }
  
    const newBooking = new this.bookingModel({
      userId: new mongoose.Types.ObjectId(userId),
      hotelId: new mongoose.Types.ObjectId(createBookingDto.hotelId),
      roomId: new mongoose.Types.ObjectId(createBookingDto.roomId),
      checkInDate: checkIn,
      checkOutDate: checkOut
    });
  
    return newBooking.save();
  }
}