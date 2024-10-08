import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Types } from 'mongoose';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('roomId/:id')
  findAllByRoomId(@Param('id') id: string) {
    return this.movieService.findAllByRoomId(id);
  }

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.create(createMovieDto);
  }

  @Get('/all')
  findAll() {
    return this.movieService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieService.findOneById(id);
  }

  @Put('/:id')
  async update(@Param('id') movieId: string, @Body() data: UpdateMovieDto) {
    return this.movieService.update(movieId, data);
  }
  @Put('/book-seat/:id')
  async bookSeat(@Param('id') movieId: string, @Body() seat: number) {
    return this.movieService.bookSeat(movieId, seat);
  }

  @Put('/space-available/:id')
  async spaceAvailable(@Param('id') movieId: string, @Body() seat: number) {
    return this.movieService.spaceAvailable(movieId, seat);
  }

  @Delete(':id')
  remove(@Param('id') id: Types.ObjectId) {
    return this.movieService.remove(id);
  }
}
