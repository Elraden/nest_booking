import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './models/room.model';
import { Model } from 'mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
	constructor(@InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>) {}

	create(createRoomDto: CreateRoomDto): Promise<Room> {
		return this.roomModel.create(createRoomDto);
	}

	findAll(): Promise<Room[]> {
		return this.roomModel.find().exec();
	}

	findById(id: string): Promise<Room | null> {
		return this.roomModel.findById(id).exec();
	}

	update(id: string, updateRoomDto: UpdateRoomDto) {
		return this.roomModel.findByIdAndUpdate(id, updateRoomDto, { new: true }).exec();
	}

	delete(id: string): Promise<Room | null> {
		return this.roomModel.findByIdAndDelete(id).exec();
	}
}
