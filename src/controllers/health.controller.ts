import { Request, Response } from 'express';
import { connection } from '../enums';
import mongoose from 'mongoose';
import { packageJson } from '@utils/packageJson.util';

export const HealthStatus = (_req: Request, res: Response): void => {
	res.status(200).send({
		name: packageJson.name,
		version: packageJson.version,
		uptime: process.uptime(),
		mongodb: {
			status: connection[mongoose.connection.readyState]
		}
	});
};
