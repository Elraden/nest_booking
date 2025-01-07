import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './models/room.model';
import { Model } from 'mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ROOM_ALREADY_EXISTS_ERROR } from './room.constants';

@Injectable()
export class RoomService {
	constructor(@InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>) {}

	async create(createRoomDto: CreateRoomDto): Promise<Room> {
		const existingRoom = await this.roomModel.findOne({ roomNumber: createRoomDto.roomNumber });
		if (existingRoom) {
			throw new HttpException(ROOM_ALREADY_EXISTS_ERROR, HttpStatus.BAD_REQUEST);
		}
		return this.roomModel.create(createRoomDto);
	}

	findAll(): Promise<Room[]> {
		return this.roomModel.find().exec();
	}

	findById(id: string): Promise<Room | null> {
		return this.roomModel.findById(id).exec();
	}

	update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room | null> {
		return this.roomModel.findByIdAndUpdate(id, updateRoomDto, { new: true }).exec();
	}

	delete(id: string): Promise<Room | null> {
		return this.roomModel.findByIdAndDelete(id).exec();
	}
}
