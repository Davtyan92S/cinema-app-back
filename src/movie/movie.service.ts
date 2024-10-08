import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Movie, MovieDocument } from './entities/movie.entity';
import { Model, Types } from 'mongoose';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    @Inject(forwardRef(() => RoomsService))
    private readonly roomsService: RoomsService,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<MovieDocument> {
    const existingMovies = await this.movieModel.find({
      roomId: createMovieDto.roomId,
      timeToStart: { $lt: createMovieDto.timeToEnd },
      timeToEnd: { $gt: createMovieDto.timeToStart },
    });

    if (existingMovies.length > 0) {
      throw new BadRequestException(
        'The movie time overlaps with an existing movie.',
      );
    }

    const newMovie = new this.movieModel({
      ...createMovieDto,
    });

    await newMovie.save();
    await this.roomsService.findAndUpdate(
      createMovieDto.roomId,
      newMovie._id as Types.ObjectId,
    );
    return newMovie;
  }

  async findOneById(movieId: string): Promise<MovieDocument> {
    return this.movieModel.findById(movieId);
  }

  async findAllByRoomId(roomId: string): Promise<MovieDocument[]> {
    return this.movieModel.find({ roomId: roomId });
  }

  async update(id: string, updateData: object): Promise<Movie | unknown> {
    const updatedMovie = await this.movieModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
    if (!updatedMovie) {
      throw new BadRequestException('Movie not found or no updates were made.');
    }
    return updatedMovie;
  }

  async bookSeat(
    movieId: string,
    seatNumber: number,
  ): Promise<Movie | unknown> {
    try {
      const updatedMovie = await this.movieModel.findByIdAndUpdate(
        movieId,
        { $addToSet: { seats: seatNumber } },
        { new: true },
      );
      if (!updatedMovie) {
        throw new BadRequestException(
          'Movie not found or no updates were made.',
        );
      }

      return updatedMovie;
    } catch (error) {
      throw new BadRequestException(
        `Failed to book the seat: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async spaceAvailable(
    movieId: string,
    seatNumber: number,
  ): Promise<Movie | unknown> {
    try {
      const updatedMovie = await this.movieModel.findByIdAndUpdate(
        movieId,
        { $pull: { seats: seatNumber } },
        { new: true },
      );
      if (!updatedMovie) {
        throw new BadRequestException(
          'Movie not found or no updates were made.',
        );
      }

      return updatedMovie;
    } catch (error) {
      throw new BadRequestException(
        `Failed to book the seat: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async deleteByRoomId(roomId: string): Promise<void> {
    const result = await this.movieModel.deleteMany({ roomId });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`No movies found for roomId ${roomId}`);
    }
  }

  findAll(): Promise<MovieDocument[]> {
    return this.movieModel.find();
  }

  async remove(id: Types.ObjectId): Promise<{ message: string }> {
    const movie = await this.movieModel.findByIdAndDelete(id).exec();
    if (!movie) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return { message: `Room with ID ${id} deleted successfully` };
  }
}
