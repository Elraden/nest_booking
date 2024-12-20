import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('room')
export class RoomController { 

	@Post('create')
	create(@Body() createRoomDto: CreateRoomDto) { }

	@Get('all')
	findAll() {}

	@Get(':id')
	findById(@Param('id') id: string) {}

	@Patch('update/:id')
	update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {}

	@Delete(':id')
	delete(@Param('id') id: string) {}
}
