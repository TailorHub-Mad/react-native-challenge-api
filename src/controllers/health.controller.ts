import { Request, Response } from 'express';
import { connection } from '../enums';
import mongoose from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../package.json');

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const HealthStatus = (_req: Request, res: Response) => {
	res.status(200).send({
		name: packageJson.name,
		version: packageJson.version,
		uptime: process.uptime(),
		mongodb: {
			status: connection[mongoose.connection.readyState]
		}
	});
};
