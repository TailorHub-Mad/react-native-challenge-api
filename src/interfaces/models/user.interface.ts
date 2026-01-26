import { Document } from 'mongoose';
import { IRestaurantDocument } from './restaurant.interface';

export interface IUser {
	email: string;
	password: string;
	name: string;
	dni?: string;
	birthDate?: Date;
	address?: string;
	favRestaurants?: IRestaurantDocument['_id'][];
}

export interface IUserDocument extends IUser, Document {
	checkPassword(_password: string): Promise<boolean>;
}
