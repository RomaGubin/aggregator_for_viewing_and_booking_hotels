//bookings.controller.ts
import { Controller, Post, Body, UseGuards, Req, Get, Param, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { UserDocument } from '../users/user.entity';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';


@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createBooking(
    @Req() req: Request,
    @Body() createBookingDto: CreateBookingDto
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    
    const user = req.user as UserDocument;
    
    if (!user?._id) {
      throw new BadRequestException('Invalid user data');
    }
  
    return this.bookingsService.createBooking(
      user._id.toString(), 
      createBookingDto
    );
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getUserBookings(@Param('userId') userId: string) {
    return this.bookingsService.getBookingsByUserId(userId);
  }
}
