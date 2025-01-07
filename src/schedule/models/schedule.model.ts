import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ScheduleDocument = HydratedDocument<Schedule>;

@Schema({ timestamps: true })
export class Schedule {
	@Prop({ type: Types.ObjectId, required: true, ref: 'Room' })
	roomId: Types.ObjectId;

	@Prop({ type: Date, required: true })
	date: Date;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
