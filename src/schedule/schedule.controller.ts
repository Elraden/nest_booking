import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Controller('schedule')
export class ScheduleController {
	@Post('create')
	async create(@Body() createScheduleDto: CreateScheduleDto) {}

	@Get('all')
	findAll() {}

	@Get(':id')
	findById(@Param('id') id: string) {}

	@Delete('delete/:id')
	delete(@Param('id') id: string) {}
}
