import { IRestaurant } from '@interfaces/models/restaurant.interface';
import { Schema, model } from 'mongoose';

const restaurantSchema = new Schema<IRestaurant>(
	{
		name: {
			type: String,
			trim: true,
			required: true,
			unique: true
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true
		},
		description: {
			type: String,
			min: 10,
			trim: true,
			max: 255
		},
		address: {
			type: String,
			trim: true,
			required: true
		},
		latlng: {
			lat: {
				type: Number,
				required: true
			},
			lng: {
				type: Number,
				required: true
			}
		},
		image: {
			type: String,
			trim: true,
			required: true
		},
		reviews: [
			{
				name: {
					type: String,
					trim: true
				},
				owner: {
					type: Schema.Types.ObjectId,
					ref: 'user'
				},
				date: {
					type: Date,
					default: Date.now
				},
				rating: {
					type: Number,
					min: 0,
					max: 5
				},
				comment: {
					type: String,
					trim: true,
					required: true,
					min: 10,
					max: 255
				}
			}
		]
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const RestaurantModel = model<IRestaurant>('restaurant', restaurantSchema);
