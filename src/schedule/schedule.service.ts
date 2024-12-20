import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Schedule, ScheduleDocument } from './models/schedule.model';
import { Model } from 'mongoose';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class ScheduleService {
	constructor(
		@InjectModel(Schedule.name) private readonly scheduleModel: Model<ScheduleDocument>,
	) {}

	async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
		const { roomId, date } = createScheduleDto;
		const bookingDate = new Date(date);
		bookingDate.setUTCHours(0, 0, 0, 0);

		const existingBooking = await this.scheduleModel.findOne({ roomId, date: bookingDate });
		if (existingBooking) {
			throw new Error('Эта комната уже забронирована на выбранную дату');
		}
		return this.scheduleModel.create(createScheduleDto);
	}

	findAll(): Promise<Schedule[]> {
		return this.scheduleModel.find().populate('roomId').exec();
	}

	findById(id: string): Promise<Schedule | null> {
		return this.scheduleModel.findById(id).populate('roomId').exec();
	}

	delete(id: string): Promise<Schedule | null> {
		return this.scheduleModel.findByIdAndDelete(id).exec();
	}
}
