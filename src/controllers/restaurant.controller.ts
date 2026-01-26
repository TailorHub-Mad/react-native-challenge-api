import {
	createCommentValidation,
	createRestaurantValidation,
	updateCommentValidation,
	updateRestaurantValidation
} from '@validations/restaurant.validation';
import { Request, Response, NextFunction } from 'express';
import restaurantService from '../services/restaurant.service';
import { mongoIdValidation, paginationValidation } from '@validations/common.validation';

export const CreateRestaurant = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await createRestaurantValidation.validateAsync(req.body);

		await restaurantService.createRestaurant(req.user._id, req.body);

		res.sendStatus(201);
	} catch (error) {
		next(error);
	}
};

export const ListRestaurant = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { limit, page } = await paginationValidation.validateAsync(
			{ limit: req.query.limit, page: req.query.page },
			{ abortEarly: false, stripUnknown: true }
		);

		const restaurants = await restaurantService.listRestaurant({
			limit,
			page
		});

		res.json(restaurants);
	} catch (error) {
		next(error);
	}
};

export const GetRestaurant = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await mongoIdValidation.validateAsync(req.params.id);
		const restaurant = await restaurantService.getRestaurant(req.params.id);

		res.json(restaurant);
	} catch (error) {
		next(error);
	}
};

export const UpdateRestaurant = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await mongoIdValidation.validateAsync(req.params.id);
		await updateRestaurantValidation.validateAsync(req.body);

		await restaurantService.updateRestaurant(req.user._id, req.params.id, req.body);

		res.sendStatus(202);
	} catch (error) {
		next(error);
	}
};

export const DeleteRestaurant = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await mongoIdValidation.validateAsync(req.params.id);
		await restaurantService.deleteRestaurant(req.user._id, req.params.id);

		res.sendStatus(202);
	} catch (error) {
		next(error);
	}
};

export const CreateComment = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await mongoIdValidation.validateAsync(req.params.id);
		await createCommentValidation.validateAsync(req.body);

		await restaurantService.createComment(req.user._id, req.params.id, req.body);

		res.sendStatus(201);
	} catch (error) {
		next(error);
	}
};

export const UpdateComment = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await mongoIdValidation.validateAsync(req.params.id);
		await mongoIdValidation.validateAsync(req.params.commentId);
		await updateCommentValidation.validateAsync(req.body);

		await restaurantService.updateComment(
			req.user._id,
			req.params.id,
			req.params.commentId,
			req.body
		);

		res.sendStatus(202);
	} catch (error) {
		next(error);
	}
};

export const DeleteComment = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await mongoIdValidation.validateAsync(req.params.id);
		await mongoIdValidation.validateAsync(req.params.commentId);
		await restaurantService.deleteComment(req.user._id, req.params.id, req.params.commentId);

		res.sendStatus(202);
	} catch (error) {
		next(error);
	}
};
