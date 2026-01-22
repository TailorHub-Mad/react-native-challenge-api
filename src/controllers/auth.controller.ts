import { Request, Response, NextFunction } from 'express';
import validationAuth from '../validations/auth.validation';
import authService from '../services/auth.service';
import { findBlackListToken } from '../repository/blacklist.repository';
import { randmonTimeOutControl, randomErrorControl } from '../utils/response.util';
import { authCookieOptions } from '../utils/cookie.util';

export const Login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = await validationAuth.login.body.validateAsync(req.body);

		const { user, token, refreshToken } = await authService.login(email, password);

		await randomErrorControl();

		res
			.header('Authorization', token)
			.cookie('refreshToken', refreshToken, authCookieOptions())
			.json(user);
	} catch (error) {
		next(error);
	}
};

export const SignUp = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password, name } = await validationAuth.register.body.validateAsync(req.body);

		await authService.signUp(email, password, name);

		res.sendStatus(201);
	} catch (error) {
		next(error);
	}
};

export const RefreshToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const validate = { refreshToken: req.cookies.refreshToken };
		const { refreshToken } = await validationAuth.refreshToken.cookies.validateAsync(validate);

		const isTokenBlackList = await findBlackListToken(refreshToken);

		if (isTokenBlackList) {
			throw new Error('Invalid token');
		}

		const { token, refreshToken: newRefreshToken } = await authService.refreshToken(refreshToken);

		res
			.header('Authorization', token)
			.cookie('refreshToken', newRefreshToken, authCookieOptions())
			.sendStatus(202);
	} catch (error) {
		next(error);
	}
};

export const Logout = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { refreshToken } = await validationAuth.logout.cookies.validateAsync(req.cookies);
		const { authorization } = await validationAuth.logout.headers.validateAsync({
			authorization: req.headers.authorization
		});

		await authService.logout(refreshToken, authorization);
		await randmonTimeOutControl();
		res
			.cookie('refreshToken', '', authCookieOptions())
			.sendStatus(202);
	} catch (error) {
		next(error);
	}
};

export const VerifyToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await authService.verifyToken(req.headers.authorization as string);

		res.json(user);
	} catch (error) {
		next(error);
	}
};
