import dotenv from 'dotenv';

dotenv.config({
  path: process.env.DOTENV_CONFIG_PATH || '.env.test',
  override: true
});

const setDefault = (key: string, value: string) => {
  if (!process.env[key]) {
    process.env[key] = value;
  }
};

setDefault('NODE_ENV', 'test');
setDefault('DATABASE_URL', 'inmemory');
setDefault('DATABASE_URL_FALLBACK', 'inmemory');
setDefault('SECRET_KEY', 'test-secret');
setDefault('CORS_ORIGINS', '*');
setDefault('AWS_REGION', 'us-east-1');
setDefault('S3_BUCKET', 'test-bucket');
setDefault('S3_UPLOAD_PREFIX', 'uploads');
setDefault('S3_URL_EXPIRATION_SECONDS', '900');
setDefault('S3_MAX_UPLOAD_BYTES', '10485760');
setDefault('AWS_ACCESS_KEY_ID', 'test');
setDefault('AWS_SECRET_ACCESS_KEY', 'test');
setDefault('MONGOMS_PORT', '27018');
