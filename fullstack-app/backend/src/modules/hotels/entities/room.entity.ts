export class Room {
  id: number;
  hotelId: number;
  name: string;
  description: string;

  constructor(id: number, hotelId: number, name: string, description: string) {
    this.id = id;
    this.hotelId = hotelId;
    this.name = name;
    this.description = description;
  }
}