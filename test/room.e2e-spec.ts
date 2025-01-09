import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect, Types } from 'mongoose';
import { CreateRoomDto } from '../src/room/dto/create-room.dto';
import { RoomType } from '../src/room/types/RoomTypeEnum';
import { ROOM_ALREADY_EXISTS_ERROR, ROOM_NOT_FOUND_ERROR } from '../src/room/room.constants';

const invalidId = new Types.ObjectId().toHexString();
const testRoomDto: CreateRoomDto = {
	roomNumber: 201,
	type: RoomType.SUITE,
	seaView: true,
};

describe('AppModule (e2e)', () => {
	let app: INestApplication;
	let createdId: string;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();
		app = moduleFixture.createNestApplication();
		await app.init();
	});

	beforeEach(async () => {
		await app.get('RoomModel').deleteMany({});
	});

	it('/room/create (POST)', async () => {
		const response = await request(app.getHttpServer())
			.post('/room/create')
			.send(testRoomDto)
			.expect(201);
		const { body }: request.Response = response;
		createdId = body._id;
		expect(createdId).toBeDefined();
	});

	it('/room/create (POST) - Create room with duplicate roomNumber', async () => {
		await request(app.getHttpServer()).post('/room/create').send(testRoomDto).expect(201);
		const response = await request(app.getHttpServer())
			.post('/room/create')
			.send(testRoomDto)
			.expect(400);
		expect(response.body.message).toBe(ROOM_ALREADY_EXISTS_ERROR);
	});

	it('/room/all (GET) - success', async () => {
		const createResponse = await request(app.getHttpServer())
			.post('/room/create')
			.send(testRoomDto)
			.expect(201);
		const createdRoom = createResponse.body;
		createdId = createdRoom._id;
		const response = await request(app.getHttpServer()).get('/room/all').expect(200);
		const { body }: request.Response = response;
		expect(body.length).toBe(1);
	});

	it('/room/all (GET) - fail', async () => {
		const response = await request(app.getHttpServer()).get('/room/all').expect(200);
		const { body }: request.Response = response;
		expect(body.length).toBe(0);
	});

	it('/room/:id (GET) - success', async () => {
		const response = await request(app.getHttpServer())
			.post('/room/create')
			.send(testRoomDto)
			.expect(201);
		const { body }: request.Response = response;
		createdId = body._id;
		await request(app.getHttpServer())
			.get('/room/' + createdId)
			.expect(200);
	});

	it('/room/:id (GET) - fail', async () => {
		await request(app.getHttpServer()).post('/room/create').send(testRoomDto).expect(201);
		const response = await request(app.getHttpServer())
			.get('/room/' + invalidId)
			.expect(404);
		const { body }: request.Response = response;
		expect(body.message).toBe(ROOM_NOT_FOUND_ERROR);
	});

	it('/room/update/:id (PATCH) - success', async () => {
		const createResponse = await request(app.getHttpServer())
			.post('/room/create')
			.send(testRoomDto)
			.expect(201);
		const createdRoom = createResponse.body;
		createdId = createdRoom._id;
		await request(app.getHttpServer())
			.patch('/room/update/' + createdId)
			.send({ ...testRoomDto, seaView: true, type: RoomType.SUPERIOR })
			.expect(200);
	});

	it('/room/update/:id (PATCH) - fail', async () => {
		const response = await request(app.getHttpServer())
			.patch('/room/update/' + invalidId)
			.send({ ...testRoomDto, seaView: true, type: RoomType.SUPERIOR })
			.expect(404);
		const { body }: request.Response = response;
		expect(body.message).toBe(ROOM_NOT_FOUND_ERROR);
	});

	it('/room/:id (DELETE) - success', async () => {
		const createResponse = await request(app.getHttpServer())
			.post('/room/create')
			.send(testRoomDto)
			.expect(201);
		const createdRoom = createResponse.body;
		createdId = createdRoom._id;
		return request(app.getHttpServer())
			.delete('/room/' + createdId)
			.expect(200);
	});

	it('/room/:id (DELETE) - fail', async () => {
		const response = await request(app.getHttpServer())
			.delete('/room/' + invalidId)
			.expect(404);
		const { body }: request.Response = response;
		expect(body.message).toBe(ROOM_NOT_FOUND_ERROR);
	});

	afterAll(async () => {
		await app.get('RoomModel').deleteMany({});
		await disconnect();
	});
});
