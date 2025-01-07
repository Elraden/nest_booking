import { RoomType } from '../types/RoomTypeEnum';

export class CreateRoomDto {
	roomNumber: number;
	type: RoomType;
	seaView: boolean;
}
