import Joi from 'joi';
import { S3_MAX_UPLOAD_BYTES } from '@constants/env.constants';

const allowedContentTypes = ['image/jpeg', 'image/png', 'image/webp'];

export const createPresignValidation = Joi.object({
	contentType: Joi.string()
		.valid(...allowedContentTypes)
		.required(),
	sizeBytes: Joi.number().integer().min(1).max(S3_MAX_UPLOAD_BYTES).required()
});
