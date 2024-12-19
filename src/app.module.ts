import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from './schedule/schedule.module';
import { RoomModule } from './room/room.module';

import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [
		MongooseModule.forRoot('mongodb://localhost:27017/booking'),
		ScheduleModule,
		RoomModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
