//booking.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/user.entity';
import { Hotel } from '../../hotels/entities/hotel.entity';
import { Room } from '../../hotels/entities/room.entity';

export type BookingDocument = Booking & mongoose.Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  })
  userId: mongoose.Types.ObjectId;

  @Prop({ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  })
  hotelId: mongoose.Types.ObjectId;

  @Prop({ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room', 
    required: true 
  })
  roomId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  checkInDate: Date;

  @Prop({ required: true })
  checkOutDate: Date;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);