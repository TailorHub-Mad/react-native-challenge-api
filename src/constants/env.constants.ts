export const PORT = process.env.PORT || 3001;

const isProduction = process.env.NODE_ENV === 'production';

export const DATABASEURL =
	process.env.DATABASE_URL ||
	process.env.MONGODB_URI ||
	(isProduction ? process.env.DATABASEURL_PROD : process.env.DATABASEURL_DEV) ||
	'mongodb://127.0.0.1:27017/tailor_hub_technical_review';

export const IV_LENGTH = +process.env.IV_LENGTH;
export const KEY = process.env.KEY;
export const ALGORITHM = 'aes-256-cbc';

export const SECRET_KEY = process.env.SECRET_KEY || 'tailor_hub_technical_review';
