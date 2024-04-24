import { Request, Response } from 'express';
import { connection } from '../enums';
import mongoose from 'mongoose';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const HealthStatus = (_req: Request, res: Response) => {
	res.status(200).send({
		name: 'API REST',
		version: '1.0.0',
		mongodb: {
			status: connection[mongoose.connection.readyState]
		}
	});
};
