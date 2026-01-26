import { NextFunction, Request, Response } from 'express';
import { IError } from '../interfaces';

export const errorHandler = (
	error: IError,
	_req: Request,
	res: Response,
	_next: NextFunction
): void => {
	try {
		let status = error.status || 500;
		if (
			Object.keys(error)[0] === '_original' ||
			error.name === 'MongoError' ||
			error.name === 'MongoServerError' ||
			error.name === 'ValidationError'
		) {
			status = 400;
		}

		if (error.message.includes('E11000')) {
			error.message = 'Duplicated key';
			error.code = 'DuplicatedKeyError';
			status = 400;
		}

		error.message = error.message || 'Something went wrong';
		logger.error(error);
		const messageError = {
			message: error.message,
			status,
			code: error.code || error.name
		};

		res.status(status).json(messageError);
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Something went wrong';
		res.status(500).json({ message });
	}
};
