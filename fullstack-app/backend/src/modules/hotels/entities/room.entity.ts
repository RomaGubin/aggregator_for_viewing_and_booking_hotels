// room.entity.ts
import * as mongoose from 'mongoose';

export class Room {
  _id: string;
  hotelId: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(
    hotelId: string,
    name: string,
    description: string,
    price: number,
    images: string[] = []
  ) {
    this._id = new mongoose.Types.ObjectId().toHexString();
    this.hotelId = hotelId;
    this.name = name;
    this.description = description;
    this.price = price;
    this.images = images;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}