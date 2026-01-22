import 'dotenv/config';
import './loaders/log.loader';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as loaders from './loaders';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { errorHandler } from './middleware/error.middleware';

export const app = express();

const getAllowedOrigins = (): string[] => {
	const envOrigins = process.env.CORS_ORIGINS?.split(',').map((origin) => origin.trim());
	const defaultOrigins = ['http://localhost:3000', 'http://localhost:8081'];

	return envOrigins && envOrigins.length > 0 ? envOrigins : defaultOrigins;
};

const allowedOrigins = getAllowedOrigins();
const allowAllOrigins = allowedOrigins.includes('*');

app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin || allowAllOrigins) {
				callback(null, true);
				return;
			}

			if (allowedOrigins.includes(origin)) {
				callback(null, true);
				return;
			}

			callback(new Error('CORS not allowed'));
		},
		credentials: true,
		exposedHeaders: ['Authorization'],
		optionsSuccessStatus: 200
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
