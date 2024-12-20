import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Schedule, ScheduleSchema } from './models/schedule.model';
import { RoomModule } from 'src/room/room.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Schedule.name, schema: ScheduleSchema }]),
		RoomModule,
	],
	controllers: [ScheduleController],
	providers: [ScheduleService],
})
export class ScheduleModule {}
