import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect, Types } from 'mongoose';
import { CreateScheduleDto } from 'src/schedule/dto/create-schedule.dto';
import { CreateRoomDto } from 'src/room/dto/create-room.dto';
import { RoomType } from 'src/room/types/RoomTypeEnum';
import {
	ROOM_ALREADY_BOOKED_ERROR,
	ROOM_NOT_EXISTS_ERROR,
	SCHEDULE_NOT_FOUND_ERROR,
} from 'src/schedule/schedule.constants';

const invalidRoomId = new Types.ObjectId().toHexString();
const invalidScheduleId = new Types.ObjectId().toHexString();
let createdRoomId: string;
let createdScheduleId: string;

const testRoomDto: CreateRoomDto = {
	roomNumber: 101,
	type: RoomType.STANDARD,
	seaView: true,
};

const testScheduleDto: CreateScheduleDto = {
	roomId: '',
	date: new Date('2025-03-01T10:00:00Z').toISOString(),
};

describe('Schedule Controller (e2e)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();
		app = moduleFixture.createNestApplication();
		await app.init();
	});

	beforeEach(async () => {
		await app.get('RoomModel').deleteMany({});
		await app.get('ScheduleModel').deleteMany({});

		const response = await request(app.getHttpServer())
			.post('/room/create')
			.send(testRoomDto)
			.expect(201);
		createdRoomId = response.body._id;
		await new Promise((resolve) => setTimeout(resolve, 500));
	});

	it('/schedule/create (POST) - room not found', async () => {
		const scheduleDto = { ...testScheduleDto, roomId: invalidRoomId };
		const response = await request(app.getHttpServer())
			.post('/schedule/create')
			.send(scheduleDto)
			.expect(400);

		expect(response.body.message).toBe(ROOM_NOT_EXISTS_ERROR);
	});

	it('/schedule/create (POST) - room already booked', async () => {
		const scheduleDto = { ...testScheduleDto, roomId: createdRoomId };
		await request(app.getHttpServer()).post('/schedule/create').send(scheduleDto).expect(201);

		const response = await request(app.getHttpServer())
			.post('/schedule/create')
			.send(scheduleDto)
			.expect(400);

		expect(response.body.message).toBe(ROOM_ALREADY_BOOKED_ERROR);
	});

	it('/schedule/:id (GET) - success', async () => {
		const scheduleDto = { ...testScheduleDto, roomId: createdRoomId };
		const createResponse = await request(app.getHttpServer())
			.post('/schedule/create')
			.send(scheduleDto)
			.expect(201);

		const scheduleId = createResponse.body._id;

		const response = await request(app.getHttpServer()).get(`/schedule/${scheduleId}`).expect(200);

		expect(response.body._id).toBe(scheduleId);
		expect(response.body.roomId._id).toBe(createdRoomId);
	});

	it('/schedule/:id (GET) - not found', async () => {
		const response = await request(app.getHttpServer())
			.get(`/schedule/${invalidRoomId}`)
			.expect(404);

		expect(response.body.message).toBe(SCHEDULE_NOT_FOUND_ERROR);
	});

	it('/schedule/all (GET) - success with data', async () => {
		const scheduleDto = { ...testScheduleDto, roomId: createdRoomId };
		await request(app.getHttpServer()).post('/schedule/create').send(scheduleDto).expect(201);

		const response = await request(app.getHttpServer()).get('/schedule/all').expect(200);

		expect(response.body).toBeInstanceOf(Array);
		expect(response.body.length).toBe(1);
		expect(response.body[0].roomId._id).toBe(createdRoomId);
	});

	it('/schedule/all (GET) - success with no data', async () => {
		await app.get('ScheduleModel').deleteMany({});

		const response = await request(app.getHttpServer()).get('/schedule/all').expect(200);

		expect(response.body).toBeInstanceOf(Array);
		expect(response.body.length).toBe(0);
	});

	it('/schedule/:id (DELETE) - success', async () => {
		const scheduleDto = { ...testScheduleDto, roomId: createdRoomId };
		const createResponse = await request(app.getHttpServer())
			.post('/schedule/create')
			.send(scheduleDto)
			.expect(201);

		createdScheduleId = createResponse.body._id;

		const deleteResponse = await request(app.getHttpServer())
			.delete(`/schedule/${createdScheduleId}`)
			.expect(200);

		expect(deleteResponse.body._id).toBe(createdScheduleId);

		const checkResponse = await request(app.getHttpServer())
			.get(`/schedule/${createdScheduleId}`)
			.expect(404);

		expect(checkResponse.body.message).toBe(SCHEDULE_NOT_FOUND_ERROR);
	});

	it('/schedule/:id (DELETE) - not found', async () => {
		const response = await request(app.getHttpServer())
			.delete(`/schedule/${invalidScheduleId}`)
			.expect(404);

		expect(response.body.message).toBe(SCHEDULE_NOT_FOUND_ERROR);
	});

	afterAll(async () => {
		await disconnect();
	});
});
