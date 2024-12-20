import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
} from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
	constructor(private readonly scheduleService: ScheduleService) {}

	@Post('create')
	async create(@Body() createScheduleDto: CreateScheduleDto) {
		try {
			return await this.scheduleService.create(createScheduleDto);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}

	@Get('all')
	findAll() {
		return this.scheduleService.findAll();
	}

	@Get(':id')
	findById(@Param('id') id: string) {
		return this.scheduleService.findById(id);
	}

	@Delete(':id')
	delete(@Param('id') id: string) {
		return this.scheduleService.delete(id);
	}
}
