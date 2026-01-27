import { Request, Response, NextFunction } from 'express';

import { AuthorizationError } from '@errors/authorization.error';
import { cleanBearerToken, validateToken } from '../utils/jwt.util';
import { findBlackListToken } from '../repository/blacklist.repository';

export const tokenValidation = async (req: Request, _res: Response, next: NextFunction) => {
	try {
		const rawToken = req.headers.authorization;
		if (!rawToken) {
			throw new AuthorizationError('No token provided, authorization denied.');
		}
		try {
			if (typeof rawToken !== 'string') {
				throw new AuthorizationError('Invalid token');
			}

			// Normalize "Bearer <token>" so clients can send standard Authorization headers.
			const token = cleanBearerToken(rawToken).trim();
			if (!token) {
				throw new AuthorizationError('Invalid token');
			}

			// Reject tokens explicitly revoked on logout.
			const isTokenBlackList = await findBlackListToken(token);

			if (isTokenBlackList) {
				throw new AuthorizationError('Invalid token');
			}

			const decoded = validateToken(token);
			if (decoded.type !== 'access') {
				throw new AuthorizationError('Invalid token');
			}
			req.user = decoded;
			next();
		} catch {
			throw new AuthorizationError('Invalid token');
		}
	} catch (error) {
		next(error);
	}
};
