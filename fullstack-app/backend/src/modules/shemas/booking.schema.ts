//booking.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type BookingDocument = Booking & Document; // Добавляем этот экспорт

@Schema()
export class Booking {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  hotelId: string;

  @Prop({ 
    required: true,
    type: mongoose.Schema.Types.ObjectId 
  })
  roomId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: Date })
  checkInDate: Date;

  @Prop({ required: true, type: Date })
  checkOutDate: Date;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
