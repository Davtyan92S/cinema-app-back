import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  poster: string;

  @IsNotEmpty()
  @IsDate()
  timeToStart: Date;

  @IsNotEmpty()
  @IsDate()
  timeToEnd: Date;

  @IsNotEmpty()
  @IsString()
  roomId: Types.ObjectId;
}
