import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } = process.env;
const hasCloudinaryConfig = Boolean(
	CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET && CLOUDINARY_CLOUD_NAME
);

const storage = hasCloudinaryConfig
	? new CloudinaryStorage({
			cloudinary,
			params: async (_, file) => {
				return {
					folder: 'Tailor_hub_technical_review',
					allowed_formats: ['jpg', 'png', 'jpeg'],
					public_id: `${new Date().getTime()} ${file.originalname}`
				};
			}
		})
	: multer.diskStorage({
			destination: (_req, _file, callback) => {
				const uploadDir = process.env.UPLOAD_DIR || path.resolve('uploads');
				fs.mkdirSync(uploadDir, { recursive: true });
				callback(null, uploadDir);
			},
			filename: (_req, file, callback) => {
				const safeName = `${Date.now()}-${file.originalname}`;
				callback(null, safeName);
			}
		});

if (hasCloudinaryConfig) {
	cloudinary.config({
		cloud_name: CLOUDINARY_CLOUD_NAME,
		api_key: CLOUDINARY_API_KEY,
		api_secret: CLOUDINARY_API_SECRET,
		secure: true
	});
}

export const multerMiddleware = multer({
	storage,
	limits: {
		fileSize: 10 * 1024 * 1024 // no larger than 10MB
	}
});
