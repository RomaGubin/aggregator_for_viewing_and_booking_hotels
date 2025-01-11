//hotel.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HotelDocument = Hotel & Document;

@Schema()
export class Hotel {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  rooms: number;

  @Prop()
  description: string;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
