import { IsMongoId, IsISO8601, IsDefined } from 'class-validator';
import {
	ROOM_ID_INVALID,
	ROOM_ID_REQUIRED,
	DATE_INVALID,
	DATE_REQUIRED,
} from '../schedule.constants';

export class CreateScheduleDto {
	@IsMongoId({ message: ROOM_ID_INVALID })
	@IsDefined({ message: ROOM_ID_REQUIRED })
	roomId: string;

	@IsISO8601({}, { message: DATE_INVALID })
	@IsDefined({ message: DATE_REQUIRED })
	date: string;
}
