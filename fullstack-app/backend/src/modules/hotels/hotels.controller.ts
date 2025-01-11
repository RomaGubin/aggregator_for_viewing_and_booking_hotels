// hotels.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/common/hotel-rooms')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get()
  async findHotelRooms(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('hotel') hotelId: string,
  ) {
    return this.hotelsService.findHotelRooms(limit, offset, hotelId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.hotelsService.findRoomById(id);
  }
}

@Controller('api/admin/hotels')
@UseGuards(AuthGuard('jwt'))
export class AdminHotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  async create(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelsService.createHotel(createHotelDto);
  }

  @Get()
  async findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.hotelsService.findAllHotels(limit, offset);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateHotelDto: UpdateHotelDto) {
    return this.hotelsService.updateHotel(id, updateHotelDto);
  }
}