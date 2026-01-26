import { Request, Response, NextFunction } from 'express';
import validationAuth from '../validations/auth.validation';
import authService from '../services/auth.service';
import { cleanBearerToken } from '../utils/jwt.util';

export const Login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = await validationAuth.login.body.validateAsync(req.body);

		const { user, token } = await authService.login(email, password);

		res.header('Authorization', token).json({ user, token });
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

export const Logout = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { authorization } = await validationAuth.logout.headers.validateAsync({
			authorization: req.headers.authorization
		});
		const token = cleanBearerToken(authorization);

		await authService.logout(token);
		res.sendStatus(202);
	} catch (error) {
		next(error);
	}
};

export const VerifyToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await authService.verifyToken(req.user._id);

		res.json(user);
	} catch (error) {
		next(error);
	}
};
