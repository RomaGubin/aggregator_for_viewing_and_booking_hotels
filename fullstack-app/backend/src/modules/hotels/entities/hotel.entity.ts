//hotel.entity.ts
export class Hotel {
  id: number;
  name: string;
  description: string;
  images: string[];

  constructor(id: number, name: string, description: string, images: string[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.images = images;
  }
}