import { IReqUser } from '../interfaces/models.interface';
import winston from 'winston';

export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DATABASE_NAME: string;
			IV_LENGTH: string;
			KEY: string;
			AWS_REGION?: string;
			AWS_DEFAULT_REGION?: string;
			S3_BUCKET?: string;
			S3_UPLOAD_PREFIX?: string;
			S3_URL_EXPIRATION_SECONDS?: string;
			S3_MAX_UPLOAD_BYTES?: string;
		}
		interface Global {
			logger: winston.Logger;
		}
	}

	namespace Express {
		interface Request {
			user: IReqUser;
		}
		namespace Multer {
			interface File {
				location: string;
				metada: {
					fieldName: string;
				};
				fieldname: string;
				originalname: string;
				mimetype: string;
				size: number;
				bucket: string;
			}
		}
	}
	const logger: winston.Logger;
}

export declare const logger: winston.Logger;
