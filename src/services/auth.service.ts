import { BaseError } from '@errors/base.error';
import { IUser } from '@interfaces/models/user.interface';
import { createUser, getUserById, getUserWithPassword } from '../repository/user.repository';
import { createToken, validateToken } from '../utils/jwt.util';
import { addBlackListToken } from '../repository/blacklist.repository';

const login = async (email: string, password: string) => {
	const user = await getUserWithPassword(email);

	if (!user) {
		throw new BaseError('User not found', 404);
	}

	const isPasswordMatch = await user.checkPassword(password);
	if (!isPasswordMatch) {
		throw new BaseError('Invalid password', 400);
	}

	const userToken = { _id: user._id, email: user.email };

	const token = createToken(userToken);

	return {
		user: user.toJSON<Omit<IUser, 'password'>>({ virtuals: false, versionKey: false }),
		token
	};
};

const logout = async (token: string) => {
	const decoded = validateToken(token);
	if (decoded.type !== 'access') {
		throw new BaseError('Invalid token', 401);
	}
	await addBlackListToken(token);
};

const signUp = async (email: string, password: string, name: string) => {
	const user = await getUserWithPassword(email);

	if (user) {
		throw new BaseError('User already exists', 400);
	}

	const newUser = await createUser(email, password, name);

	return newUser.toJSON<Omit<IUser, 'password'>>({ virtuals: true, versionKey: false });
};

const verifyToken = async (userId: string) => {
	const user = await getUserById(userId);

	if (!user) {
		throw new BaseError('User not found', 404);
	}

	return user;
};

export default {
	login,
	logout,
	signUp,
	verifyToken
};
