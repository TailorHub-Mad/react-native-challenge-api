import Joi from 'joi';

export default {
	register: {
		body: Joi.object().keys({
			email: Joi.string().required().email(),
			password: Joi.string().required().min(6).max(128),
			name: Joi.string().required().max(128)
		})
	},
	login: {
		body: Joi.object().keys({
			email: Joi.string().required().email(),
			password: Joi.string().required().max(128)
		})
	},
	logout: {
		headers: Joi.object().keys({
			authorization: Joi.string().required()
		})
	},
	verifyToken: {
		headers: Joi.object().keys({
			authorization: Joi.string().required()
		})
	}
};
