import { IComment, IRestaurant } from '@interfaces/models/restaurant.interface';
import {
	addComment,
	createRestaurantRepository,
	deleteRestaurantRepository,
	deleteReview,
	getRestaurantById,
	getRestaurantList,
	updateRestaurantRepository,
	updateReview
} from '../repository/restaurant.repository';
import { BaseError } from '@errors/base.error';

const createRestaurant = async (userId: string, restaurant: IRestaurant) => {
	await createRestaurantRepository(userId, restaurant);
};

const updateRestaurant = async (userId: string, restaurantId: string, restaurant: IRestaurant) => {
	const restaurantUpdate = await updateRestaurantRepository(userId, restaurantId, restaurant);

	if (!restaurantUpdate) {
		throw new BaseError('Restaurant not found', 404);
	}
};

const deleteRestaurant = async (userId: string, restaurantId: string) => {
	const restaurant = await deleteRestaurantRepository(userId, restaurantId);

	if (!restaurant) {
		throw new BaseError('Restaurant not found', 404);
	}
};

const listRestaurant = async (pagination: { limit: number; page: number }) => {
	const restaurants = await getRestaurantList(pagination.page, pagination.limit);

	return restaurants;
};

const getRestaurant = async (restaurantId: string) => {
	const restaurant = await getRestaurantById(restaurantId);

	if (!restaurant) {
		throw new BaseError('Restaurant not found', 404);
	}

	return restaurant;
};

const createComment = async (userId: string, restaurantId: string, comment: IComment) => {
	await addComment(userId, restaurantId, comment);
};

const updateComment = async (
	userId: string,
	restaurantId: string,
	commentId: string,
	comment: IComment
) => {
	const commentUpdate = await updateReview(userId, restaurantId, commentId, comment);

	const matchedCount =
		'matchedCount' in commentUpdate
			? commentUpdate.matchedCount
			: ((commentUpdate as { n?: number }).n ?? 0);
	const modifiedCount =
		'modifiedCount' in commentUpdate
			? commentUpdate.modifiedCount
			: ((commentUpdate as { nModified?: number }).nModified ?? 0);

	if (matchedCount === 0 && modifiedCount === 0) {
		throw new BaseError('Comment not found', 404);
	}
};

const deleteComment = async (userId: string, restaurantId: string, commentId: string) => {
	const comment = await deleteReview(userId, restaurantId, commentId);

	if (!comment) {
		throw new BaseError('Comment not found', 404);
	}
};

export default {
	createComment,
	updateComment,
	deleteComment,
	createRestaurant,
	updateRestaurant,
	deleteRestaurant,
	listRestaurant,
	getRestaurant
};
