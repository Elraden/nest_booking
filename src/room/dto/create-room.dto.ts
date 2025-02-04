import { IsInt, IsBoolean, IsPositive, IsEnum, IsNotEmpty } from 'class-validator';
import { RoomType } from '../types/RoomTypeEnum';
import {
	ROOM_NUMBER_MUST_BE_INT,
	ROOM_NUMBER_POSITIVE,
	ROOM_NUMBER_REQUIRED,
	SEAVIEW_BOOLEAN,
	SEAVIEW_REQUIRED,
	TYPE_INVALID,
	TYPE_REQUIRED,
} from '../room.constants';

export class CreateRoomDto {
	@IsInt({ message: ROOM_NUMBER_MUST_BE_INT })
	@IsPositive({ message: ROOM_NUMBER_POSITIVE })
	@IsNotEmpty({ message: ROOM_NUMBER_REQUIRED })
	roomNumber: number;

	@IsEnum(RoomType, { message: TYPE_INVALID })
	@IsNotEmpty({ message: TYPE_REQUIRED })
	type: RoomType;

	@IsBoolean({ message: SEAVIEW_BOOLEAN })
	@IsNotEmpty({ message: SEAVIEW_REQUIRED })
	seaView: boolean;
}
