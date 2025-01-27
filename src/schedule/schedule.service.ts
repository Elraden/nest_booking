import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Schedule, ScheduleDocument } from './models/schedule.model';
import { Model } from 'mongoose';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Room, RoomDocument } from 'src/room/models/room.model';
import {
	ROOM_NOT_EXISTS_ERROR,
	ROOM_ALREADY_BOOKED_ERROR,
	SCHEDULE_NOT_FOUND_ERROR,
} from './schedule.constants';

@Injectable()
export class ScheduleService {
	constructor(
		@InjectModel(Schedule.name) private readonly scheduleModel: Model<ScheduleDocument>,
		@InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
	) {}

	async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
		const { roomId, date } = createScheduleDto;

		const roomExists = await this.roomModel.exists({ _id: roomId });
		if (!roomExists) {
			throw new HttpException(ROOM_NOT_EXISTS_ERROR, HttpStatus.BAD_REQUEST);
		}

		const bookingDate = new Date(date);
		bookingDate.setUTCHours(0, 0, 0, 0);

		const existingBooking = await this.scheduleModel.findOne({
			roomId,
			date: bookingDate.toISOString(),
		});

		if (existingBooking) {
			throw new Error(ROOM_ALREADY_BOOKED_ERROR);
		}
		return this.scheduleModel.create({ ...createScheduleDto, date: bookingDate.toISOString() });
	}

	findAll(): Promise<Schedule[]> {
		return this.scheduleModel.find().populate('roomId').exec();
	}

	async findById(id: string): Promise<Schedule | null> {
		const schedule = await this.scheduleModel.findById(id).populate('roomId').exec();
		if (!schedule) {
			throw new HttpException(SCHEDULE_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
		}
		return schedule;
	}

	async delete(id: string): Promise<Schedule | null> {
		const schedule = await this.scheduleModel.findByIdAndDelete(id);
		if (!schedule) {
			throw new HttpException(SCHEDULE_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
		}
		return schedule;
	}
}
