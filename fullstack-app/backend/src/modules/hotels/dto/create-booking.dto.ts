// create-booking.dto.ts
import { IsString, IsNotEmpty, IsISO8601 } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsISO8601()
  checkInDate: string;

  @IsISO8601()
  checkOutDate: string;
}