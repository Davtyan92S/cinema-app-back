import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './entities/room.entity';
import { Model, Types } from 'mongoose';
import { UpdateRoomDto } from './dto/update-room.dto';
import { MovieService } from '../movie/movie.service';

@Injectable()
export class RoomsService {
  constructor(
    private readonly movieService: MovieService,

    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<RoomDocument> {
    const createdRoom = new this.roomModel(createRoomDto);
    return createdRoom.save();
  }

  async findAll(): Promise<RoomDocument[]> {
    return this.roomModel.find().populate('movies').exec();
  }

  async findById(id: string): Promise<RoomDocument> {
    return this.roomModel.findById(id).exec();
  }

  async findAndUpdate(
    roomId: Types.ObjectId,
    newMovieId: Types.ObjectId,
  ): Promise<RoomDocument> {
    return this.roomModel.findByIdAndUpdate(
      roomId,
      { $addToSet: { movies: newMovieId } },
      { new: true },
    );
  }

  async removeMovieFromRoom(
    roomId: Types.ObjectId,
    movieId: Types.ObjectId,
  ): Promise<RoomDocument | null> {
    return this.roomModel.findByIdAndUpdate(
      { _id: roomId },
      { $pull: { movies: movieId } },
      { new: true },
    );
  }

  async update(data: UpdateRoomDto, id: string): Promise<RoomDocument> {
    const updatedRoom = await this.roomModel
      .findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
      .exec();

    if (!updatedRoom) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return updatedRoom;
  }

  async remove(id: string): Promise<{ message: string }> {
    const room = await this.roomModel.findByIdAndDelete(id).exec();
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    await this.movieService.deleteByRoomId(id);
    return { message: `Room with ID ${id} deleted successfully` };
  }
}
