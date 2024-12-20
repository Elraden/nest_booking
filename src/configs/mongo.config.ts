import { ConfigService } from '@nestjs/config';

export const getMongoConfig = (configService: ConfigService) => {
	return {
		uri: `mongodb://${configService.get<string>('MONGO_LOGIN')}:${configService.get<string>('MONGO_PASSWORD')}@${configService.get<string>('MONGO_HOST')}:${configService.get<string>('MONGO_PORT')}/${configService.get<string>('MONGO_DB')}?authSource=${configService.get<string>('MONGO_AUTH_SOURCE')}`,
	};
};
