import { Router } from 'express';
import { tokenValidation } from '../middleware/tokenValidation.middleware';
import { CreatePresignedUpload } from '../controllers/upload.controller';

const router = Router();

router.post('/presign', tokenValidation, CreatePresignedUpload);

export const UploadRoute = { path: '/upload', router };
