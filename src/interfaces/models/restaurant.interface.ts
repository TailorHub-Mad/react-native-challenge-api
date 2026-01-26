import { Document } from 'mongoose';
import { IUserDocument } from './user.interface';

export interface IComment {
	_id?: string;
	name?: string;
	owner?: IUserDocument['_id'];
	date?: Date;
	rating?: number;
	comment?: string;
}

export interface IRestaurant {
	name: string;
	owner: IUserDocument['_id'];
	address: string;
	image: string;
	description?: string;
	latlng: {
		lat: number;
		lng: number;
	};
	reviews?: IComment[];
}

export interface IRestaurantDocument extends IRestaurant, Document {}
