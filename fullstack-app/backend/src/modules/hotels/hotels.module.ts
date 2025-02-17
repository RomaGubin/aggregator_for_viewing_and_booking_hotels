//hotels.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { Hotel, HotelSchema } from '../shemas/hotel.schema';
import { Booking, BookingSchema } from '../shemas/booking.schema';
import { BookingsController } from '../hotels/bookings.controller';
import { BookingsService } from '../hotels/bookings.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: Booking.name, schema: BookingSchema }
    ])
  ],
  controllers: [HotelsController, BookingsController],
  providers: [HotelsService, BookingsService],
  exports: [HotelsService, BookingsService],
})
export class HotelsModule {}

