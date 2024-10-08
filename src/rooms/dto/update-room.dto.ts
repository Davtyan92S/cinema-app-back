import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  seatCount?: number;
}
