//hotels.service.ts
import { Injectable } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';

@Injectable()
export class HotelsService {
  private hotels = [];

  async findHotelRooms(limit: number, offset: number, hotelId: string) {
    return this.hotels.filter(h => h.isEnabled);
  }

  async findRoomById(id: string) {
    return this.hotels.find(h => h.id === id);
  }

  async createHotel(createHotelDto: CreateHotelDto) {
    const newHotel = { id: Date.now().toString(), ...createHotelDto };
    this.hotels.push(newHotel);
    return newHotel;
  }

  async findAllHotels(limit: number, offset: number) {
    return this.hotels.slice(offset, offset + limit);
  }

  async updateHotel(id: string, updateHotelDto: UpdateHotelDto) {
    const hotelIndex = this.hotels.findIndex(h => h.id === id);
    if (hotelIndex > -1) {
      const updatedHotel = { ...this.hotels[hotelIndex], ...updateHotelDto };
      this.hotels[hotelIndex] = updatedHotel;
      return updatedHotel;
    }
    throw new Error('Hotel not found');
  }
}