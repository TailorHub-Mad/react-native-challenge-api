import { randomUUID } from 'crypto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BaseError } from '@errors/base.error';
import {
	S3_BUCKET,
	S3_MAX_UPLOAD_BYTES,
	S3_PUBLIC_BASE_URL,
	S3_REGION,
	S3_UPLOAD_PREFIX,
	S3_URL_EXPIRATION_SECONDS
} from '@constants/env.constants';

// Keep upload formats explicit to prevent unexpected content uploads.
const allowedContentTypes: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp'
};

const buildObjectKey = (extension: string): string => {
	// Partition keys by date to keep buckets manageable over time.
	const now = new Date();
	const year = now.getUTCFullYear();
	const month = String(now.getUTCMonth() + 1).padStart(2, '0');
	const day = String(now.getUTCDate()).padStart(2, '0');
	const fileId = randomUUID();
	return `${S3_UPLOAD_PREFIX}/${year}/${month}/${day}/${fileId}.${extension}`;
};

const resolvePublicBaseUrl = (): string => {
	if (S3_PUBLIC_BASE_URL) {
		return S3_PUBLIC_BASE_URL.replace(/\/+$/, '');
	}
	// Default to the S3 regional public hostname when no CDN base URL is set.
	return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com`;
};

const s3Client = new S3Client({ region: S3_REGION });

export const createPresignedUpload = async (
	contentType: string,
	sizeBytes: number
): Promise<{
	uploadUrl: string;
	publicUrl: string;
	objectKey: string;
	expiresIn: number;
	maxSizeBytes: number;
}> => {
	if (!S3_BUCKET) {
		throw new BaseError('S3 bucket not configured', 500);
	}

	const extension = allowedContentTypes[contentType];
	if (!extension) {
		throw new BaseError('Unsupported content type', 400);
	}

	if (sizeBytes > S3_MAX_UPLOAD_BYTES) {
		throw new BaseError('File too large', 400);
	}

	const objectKey = buildObjectKey(extension);
	const command = new PutObjectCommand({
		Bucket: S3_BUCKET,
		Key: objectKey,
		ContentType: contentType
	});

	const uploadUrl = await getSignedUrl(s3Client, command, {
		expiresIn: S3_URL_EXPIRATION_SECONDS
	});
	const publicUrl = `${resolvePublicBaseUrl()}/${objectKey}`;

	return {
		uploadUrl,
		publicUrl,
		objectKey,
		expiresIn: S3_URL_EXPIRATION_SECONDS,
		maxSizeBytes: S3_MAX_UPLOAD_BYTES
	};
};

export default {
	createPresignedUpload
};
