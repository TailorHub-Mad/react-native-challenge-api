import { NextFunction, Request, Response, Router } from 'express';

export interface IRouter {
	path: string;
	router: Router;
}

export interface IRouterMid extends IRouter {
	middelware: (_req: Request, _res: Response, _next: NextFunction) => void;
}
