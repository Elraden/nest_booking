import { ConfigService } from '@nestjs/config';

export const getMongoConfig = (configService: ConfigService) => {
	const login = configService.get<string>('MONGO_LOGIN');
	const password = configService.get<string>('MONGO_PASSWORD');
	const host = configService.get<string>('MONGO_HOST');
	const port = configService.get<string>('MONGO_PORT');
	const dbName = configService.get<string>('MONGO_DB');
	const authSource = configService.get<string>('MONGO_AUTH_SOURCE');
	return {
		uri: `mongodb://${login}:${password}@${host}:${port}/${dbName}?authSource=${authSource}`,
	};
};
