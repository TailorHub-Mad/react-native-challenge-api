import 'dotenv/config';
import './loaders/log.loader';
import * as http from 'http';
import express from 'express';
import { PORT } from '@constants/env.constants';
import cors from 'cors';
import helmet from 'helmet';
import * as loaders from './loaders';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { errorHandler } from './middleware/error.middleware';
import { MongoConnection } from './loaders/db.loader';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../package.json');

export const app = express();

app.use(
	cors({
		origin: true,
		credentials: true
	})
);

app.use(helmet());

app.use((_req, res, next) => {
	res.setHeader('Permissions-Policy', 'geolocation=(), interest-cohort=()'); // TODO: update  geolocation=(self "https://example.com"), microphone=()
	next();
});

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(express.json());
// Ejecutamos la configuración de morgan para los logs en dev.
app.use(loaders.morganMiddleware);

const processId = process.pid;
// Ruta necesario para Faable, siempre devolverá un estado 200.
app.get('/', async (req, res) => {
	console.log(req.body);
	res.json({ status: `Process 200` });
});
// Cargamos todos los middlewares que se encuentren que exporte el archivo ./middleware/index.ts
loaders.middlewares(app);
// Configuramos el router con las rutas que exporte el archivo ./routes/index.ts
loaders.router(app);
// Controlamos cualquier error que ocurra de la aplicación que se envie por next.
app.use(errorHandler);

app.use((_req, res) => {
	res.status(404).json({ message: 'Not Found' });
});

// Ejecutamos la BD e inicializamos el servidor.
new Promise((resolve) => resolve(MongoConnection.open()))
	.then(() => {
		const server = http.createServer(app);
		return server;
	})
	.then((server) => {
		server.listen(PORT, () => {
			logger.info(`${packageJson.name} ${packageJson.version} listening on port ${PORT}!`);
			logger.info(`PROD mode is ${process.env.NODE_ENV === 'production' ? 'ON' : 'OFF'}`);
			logger.info(`Running on port ${PORT}`);
			logger.info(`Server Started in process ${processId}`);
		});
		// Creamos un observer por si ocurre algún error para tener información sobre este.
		server.on('error', loaders.onError);
	})
	.catch((err) => logger.error(`Error: ${err}`));
