declare module 'swagger-ui-express' {
	import { RequestHandler } from 'express';

	const swaggerUi: {
		serve: RequestHandler;
		setup: (_swaggerDoc: unknown, _options?: Record<string, unknown>) => RequestHandler;
	};

	export default swaggerUi;
}
