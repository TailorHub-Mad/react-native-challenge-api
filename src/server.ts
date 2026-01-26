import 'dotenv/config';
import './loaders/log.loader';
import * as http from 'http';
import { app } from './app';
import { PORT } from '@constants/env.constants';
import * as loaders from './loaders';
import { MongoConnection } from './loaders/db.loader';
import { packageJson } from '@utils/packageJson.util';

const processId = process.pid;

const startServer = async (): Promise<void> => {
	try {
		await MongoConnection.open();

		const server = http.createServer(app);

		server.listen(PORT, () => {
			logger.info(`${packageJson.name} ${packageJson.version} listening on port ${PORT}!`);
			logger.info(`PROD mode is ${process.env.NODE_ENV === 'production' ? 'ON' : 'OFF'}`);
			logger.info(`Running on port ${PORT}`);
			logger.info(`Server Started in process ${processId}`);
		});

		server.on('error', loaders.onError);
	} catch (err) {
		logger.error(`Error: ${err}`);
	}
};

startServer();
