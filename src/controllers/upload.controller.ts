import { Request, Response, NextFunction } from 'express';
import { createPresignValidation } from '@validations/upload.validation';
import uploadService from '../services/upload.service';

export const CreatePresignedUpload = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { contentType, sizeBytes } = await createPresignValidation.validateAsync(req.body);
		const payload = await uploadService.createPresignedUpload(contentType, sizeBytes);

		res.json(payload);
	} catch (error) {
		next(error);
	}
};
