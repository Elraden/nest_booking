import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	@Post('create')
	create(@Body() createRoomDto: CreateRoomDto) {
		return this.roomService.create(createRoomDto);
	}

	@Get('all')
	findAll() {
		return this.roomService.findAll();
	}

	@Get(':id')
	findById(@Param('id') id: string) {
		return this.roomService.findById(id);
	}

	@Patch('update/:id')
	update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
		return this.roomService.update(id, updateRoomDto);
	}

	@Delete(':id')
	delete(@Param('id') id: string) {
		return this.roomService.delete(id);
	}
}
