import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DATABASEURL, DATABASE_FALLBACK_URL } from '@constants/env.constants';

const isProduction = process.env.NODE_ENV === 'production';

mongoose.set('debug', !isProduction);

// inicializamos las diferentes opciones de mongoose.
const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	autoIndex: !isProduction, // Dev == true; Prod == false
	serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
	socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
};

const resolvedDatabaseUrl = DATABASEURL || DATABASE_FALLBACK_URL;
const usingFallback = !DATABASEURL;

export namespace MongoConnection {
	let _mongoServer: MongoMemoryServer;
	let _listenersAttached = false;
	export const open = async (): Promise<void> => {
		try {
			if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
				return;
			}

			if (resolvedDatabaseUrl === 'inmemory') {
				logger.debug('connecting to inmemory mongo db');
				const parsedPort = process.env.MONGOMS_PORT ? Number(process.env.MONGOMS_PORT) : undefined;
				const memoryPort = Number.isFinite(parsedPort) ? parsedPort : undefined;
				_mongoServer = new MongoMemoryServer({
					instance: { ip: '127.0.0.1', port: memoryPort }
				});
				await _mongoServer.start(Boolean(memoryPort));
				const mongoUrl = _mongoServer.getUri();
				await mongoose.connect(mongoUrl, options);
			} else {
				const targetUrl = resolvedDatabaseUrl;
				const fallbackTag = usingFallback ? ' (fallback)' : '';
				console.log(`connecting to mongo db: ${targetUrl}${fallbackTag}`);
				logger.debug(`connecting to mongo db: ${targetUrl}${fallbackTag}`);
				await mongoose.connect(targetUrl, options);
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
							mongoose.connect(resolvedDatabaseUrl, options).catch(logger.error);
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
			if (resolvedDatabaseUrl === 'inmemory') {
				await _mongoServer?.stop();
			}
		} catch (err) {
			logger.error(`db.open: ${err}`);
			throw err;
		}
	};
}
