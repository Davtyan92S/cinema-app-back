import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Movie } from '../../movie/entities/movie.entity';

export interface IRoom {
  name: string;
  description?: string;
  mobies: Types.ObjectId[];
}

export type RoomDocument = IRoom & Document;

@Schema()
export class Room {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: 30 })
  seatCount?: number;

  @Prop({ type: [Types.ObjectId], ref: Movie.name })
  movies?: Types.ObjectId[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
