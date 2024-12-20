import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './models/room.model';
import { RoomService } from './room.service';

@Module({
	controllers: [RoomController],
	imports: [MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }])],
	providers: [RoomService],
})
export class RoomModule {}
