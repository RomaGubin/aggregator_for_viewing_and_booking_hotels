//hotel.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type HotelDocument = Hotel & Document;

@Schema({ _id: false })
export class Room {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop([String])
  images: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

@Schema({ timestamps: true })
export class Hotel {
  @Prop({ index: true })
  name: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop()
  rooms: Array<any>;

  @Prop()
  bookings: Array<any>;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
