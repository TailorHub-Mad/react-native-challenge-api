import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DATABASEURL } from '@constants/env.constants';

mongoose.set('debug', true);

// inicializamos las diferentes opciones de mongoose.
const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	autoIndex: true, // Dev == true; Prod == false
	serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
	socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
};

export namespace MongoConnection {
	let _mongoServer: MongoMemoryServer;
	let _listenersAttached = false;
	export const open = async (): Promise<void> => {
		try {
			if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
				return;
			}

			if (DATABASEURL === 'inmemory') {
				logger.debug('connecting to inmemory mongo db');
				_mongoServer = new MongoMemoryServer();
				const mongoUrl = await _mongoServer.getUri();
				await mongoose.connect(mongoUrl, options);
			} else {
				console.log('connecting to mongo db: ' + DATABASEURL);
				logger.debug('connecting to mongo db: ' + DATABASEURL);
				await mongoose.connect(DATABASEURL, options);
			}

			if (!_listenersAttached) {
				mongoose.connection.on('connected', () => {
					logger.info('Mongo: connected');
				});

				mongoose.connection.on('disconnected', () => {
					logger.error('Mongo: disconnected');
				});

				mongoose.connection.on('error', (err) => {
					logger.error(`Mongo:  ${String(err)}`);
					if (err.name === 'MongoNetworkError') {
						setTimeout(function () {
							mongoose.connect(DATABASEURL, options).catch(logger.error);
						}, 5000);
					}
				});

				_listenersAttached = true;
			}
		} catch (err) {
			logger.error(`db.open: ${err}`);
			throw err;
		}
	};
	export const close = async (): Promise<void> => {
		try {
			await mongoose.disconnect();
			if (DATABASEURL === 'inmemory') {
				await _mongoServer?.stop();
			}
		} catch (err) {
			logger.error(`db.open: ${err}`);
			throw err;
		}
	};
}
