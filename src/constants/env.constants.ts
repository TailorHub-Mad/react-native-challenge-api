export const PORT = process.env.PORT || 3001;

const isProduction = process.env.NODE_ENV === 'production';

export const DATABASE_NAME = process.env.DATABASE_NAME || 'react-native-challenge-api';

const ensureDatabaseName = (url: string, dbName: string): string => {
	if (!url || url === 'inmemory') {
		return url;
	}

	const schemeIndex = url.indexOf('://');
	if (schemeIndex === -1) {
		return url;
	}

	const pathIndex = url.indexOf('/', schemeIndex + 3);
	if (pathIndex === -1) {
		return `${url}/${dbName}`;
	}

	const queryIndex = url.indexOf('?', pathIndex);
	const path = url.slice(pathIndex, queryIndex === -1 ? url.length : queryIndex);
	if (path === '/' || path === '') {
		const base = url.slice(0, pathIndex);
		const query = queryIndex === -1 ? '' : url.slice(queryIndex);
		return `${base}/${dbName}${query}`;
	}

	return url;
};

const primaryDatabaseUrl =
	process.env.DATABASE_URL ||
	process.env.MONGODB_URI ||
	(isProduction ? process.env.DATABASEURL_PROD : process.env.DATABASEURL_DEV);

if (isProduction && !primaryDatabaseUrl) {
	throw new Error('DATABASE_URL is required in production');
}

export const DATABASEURL = primaryDatabaseUrl
	? ensureDatabaseName(primaryDatabaseUrl, DATABASE_NAME)
	: '';
export const DATABASE_FALLBACK_URL = ensureDatabaseName(
	process.env.DATABASE_URL_FALLBACK || 'mongodb://127.0.0.1:27017/react-native-challenge-api',
	DATABASE_NAME
);

export const IV_LENGTH = +process.env.IV_LENGTH;
export const KEY = process.env.KEY;
export const ALGORITHM = 'aes-256-cbc';

const resolveSecretKey = (): string => {
	const secret = process.env.SECRET_KEY;
	if (secret) {
		return secret;
	}
	if (isProduction) {
		throw new Error('SECRET_KEY is required in production');
	}
	return 'react-native-challenge-api';
};

const resolveS3Region = (): string => {
	const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
	if (region) {
		return region;
	}
	if (isProduction) {
		throw new Error('AWS_REGION is required in production');
	}
	return 'us-east-1';
};

const resolveS3Bucket = (): string => {
	const bucket = process.env.S3_BUCKET;
	if (bucket) {
		return bucket;
	}
	if (isProduction) {
		throw new Error('S3_BUCKET is required in production');
	}
	return '';
};

export const SECRET_KEY = resolveSecretKey();

export const S3_REGION = resolveS3Region();
export const S3_BUCKET = resolveS3Bucket();
export const S3_UPLOAD_PREFIX = process.env.S3_UPLOAD_PREFIX || 'uploads';
export const S3_PUBLIC_BASE_URL = process.env.S3_PUBLIC_BASE_URL || '';
export const S3_URL_EXPIRATION_SECONDS = Number(process.env.S3_URL_EXPIRATION_SECONDS || 900);
export const S3_MAX_UPLOAD_BYTES = Number(process.env.S3_MAX_UPLOAD_BYTES || 10 * 1024 * 1024);
