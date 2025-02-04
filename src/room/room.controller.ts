import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomService } from './room.service';
import { ROOM_NOT_FOUND_ERROR } from './room.constants';

@Controller('room')
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	@Post('create')
	@UsePipes(new ValidationPipe({ transform: true }))
	create(@Body() createRoomDto: CreateRoomDto) {
		return this.roomService.create(createRoomDto);
	}

	@Get('all')
	findAll() {
		return this.roomService.findAll();
	}

	@Get(':id')
	async findById(@Param('id') id: string) {
		const room = await this.roomService.findById(id);
		if (!room) {
			throw new HttpException(ROOM_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
		}
		return room;
	}

	@Patch('update/:id')
	async update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
		const updatedRoom = await this.roomService.update(id, updateRoomDto);
		if (!updatedRoom) {
			throw new HttpException(ROOM_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
		}
		return updatedRoom;
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		const deletedRoom = await this.roomService.delete(id);
		if (!deletedRoom) {
			throw new HttpException(ROOM_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
		}
		return deletedRoom;
	}
}
