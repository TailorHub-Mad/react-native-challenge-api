import { CookieOptions } from 'express';

export const authCookieOptions = (): CookieOptions => {
	const isProduction = process.env.NODE_ENV === 'production';

	return {
		httpOnly: true,
		sameSite: isProduction ? 'none' : 'lax',
		secure: isProduction
	};
};
