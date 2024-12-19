import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './models/room.model';

@Module({
	controllers: [RoomController],
	imports: [MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema}])]
})
export class RoomModule {}
