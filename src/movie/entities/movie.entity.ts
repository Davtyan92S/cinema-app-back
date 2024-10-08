import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export interface IMovie {
  roomId: Types.ObjectId;
  name: string;
  posterUrl: string;
  timeToStart: Date;
  timeToEnd: Date;
  reservedSeatIds: number[];
}

export type MovieDocument = IMovie & Document;

@Schema()
export class Movie {
  @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
  roomId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  poster: string;

  @Prop({ required: true })
  timeToStart: Date;

  @Prop({ required: true })
  timeToEnd: Date;

  @Prop()
  seats?: number[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

MovieSchema.index({ timeToEnd: 1 }, { expireAfterSeconds: 0 });
