import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { RoomType } from '../types/RoomTypeEnum';
import { HydratedDocument } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room {
	@Prop({ required: true, unique: true })
	roomNumber: number;

	@Prop({ required: true, enum: RoomType })
	type: RoomType;

	@Prop({ default: false })
	seaView: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
