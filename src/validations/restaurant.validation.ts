import Joi from 'joi';

export const createRestaurantValidation = Joi.object({
	name: Joi.string().required(),
	address: Joi.string().required(),
	image: Joi.string().uri().required(),
	description: Joi.string().min(10),
	latlng: Joi.object({
		lat: Joi.number().required(),
		lng: Joi.number().required()
	}).required()
});

export const updateRestaurantValidation = Joi.object({
	name: Joi.string(),
	address: Joi.string(),
	image: Joi.string().uri(),
	description: Joi.string().min(10),
	latlng: Joi.object({
		lat: Joi.number(),
		lng: Joi.number()
	})
});

export const createCommentValidation = Joi.object({
	comment: Joi.string().min(10).max(255).required(),
	rating: Joi.number().min(1).max(5).required()
});
export const updateCommentValidation = Joi.object({
	comment: Joi.string().min(10).max(255),
	rating: Joi.number().min(1).max(5)
});
