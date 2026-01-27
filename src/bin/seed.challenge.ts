import 'dotenv/config';
import '../loaders/log.loader';
import { Types } from 'mongoose';
import { MongoConnection } from '../loaders/db.loader';
import { UserModel } from '../model/user.model';
import { RestaurantModel } from '../model/restaurant.model';

type ReviewSeed = { name: string; rating: number; comment: string };

const adminUserSeed = {
	email: 'admin@tailor-hub.com',
	name: 'Tailor Admin',
	password: '1234qweR..',
	dni: '12345678A',
	birthDate: new Date('1990-05-10'),
	address: 'Puerta del Sol 1, Madrid, Spain'
};

const reviewSeeds: ReviewSeed[] = [
	{
		name: 'Maria Lopez',
		rating: 5,
		comment: 'Great food, warm service, and a calm vibe in the center.'
	},
	{
		name: 'Carlos Ruiz',
		rating: 4,
		comment: 'Solid menu and good portions. Will return with friends.'
	}
];

const buildRestaurants = (ownerId: Types.ObjectId) => [
	{
		name: 'La Plaza Bistro',
		owner: ownerId,
		address: 'Plaza Mayor 4, Madrid',
		image: 'https://picsum.photos/seed/madrid-1/800/600',
		description: 'Classic flavors with a modern twist near Plaza Mayor.',
		latlng: { lat: 40.4154, lng: -3.7074 },
		reviews: reviewSeeds.map((review) => ({ ...review, owner: ownerId }))
	},
	{
		name: 'Gran Via Tapas',
		owner: ownerId,
		address: 'Gran Via 28, Madrid',
		image: 'https://picsum.photos/seed/madrid-2/800/600',
		description: 'Tapas, croquetas, and seasonal specials by Gran Via.',
		latlng: { lat: 40.4203, lng: -3.7058 },
		reviews: reviewSeeds.map((review) => ({ ...review, owner: ownerId }))
	},
	{
		name: 'Retiro Verde',
		owner: ownerId,
		address: 'Calle de Alfonso XII 2, Madrid',
		image: 'https://picsum.photos/seed/madrid-3/800/600',
		description: 'Fresh plates and light lunches beside Parque del Retiro.',
		latlng: { lat: 40.4159, lng: -3.6843 },
		reviews: reviewSeeds.map((review) => ({ ...review, owner: ownerId }))
	},
	{
		name: 'Malasana Bites',
		owner: ownerId,
		address: 'Calle Fuencarral 89, Madrid',
		image: 'https://picsum.photos/seed/madrid-4/800/600',
		description: 'Casual bites, craft drinks, and a relaxed late night vibe.',
		latlng: { lat: 40.4276, lng: -3.7036 },
		reviews: reviewSeeds.map((review) => ({ ...review, owner: ownerId }))
	},
	{
		name: 'Chueca Corner',
		owner: ownerId,
		address: 'Calle Hortaleza 63, Madrid',
		image: 'https://picsum.photos/seed/madrid-5/800/600',
		description: 'Neighborhood favorite with bold flavors and quick service.',
		latlng: { lat: 40.4239, lng: -3.6973 },
		reviews: reviewSeeds.map((review) => ({ ...review, owner: ownerId }))
	},
	{
		name: 'Lavapies Sabor',
		owner: ownerId,
		address: 'Calle de Lavapies 36, Madrid',
		image: 'https://picsum.photos/seed/madrid-6/800/600',
		description: 'Global comfort food inspired by the Lavapies scene.',
		latlng: { lat: 40.4089, lng: -3.7009 },
		reviews: reviewSeeds.map((review) => ({ ...review, owner: ownerId }))
	},
	{
		name: 'Salamanca Table',
		owner: ownerId,
		address: 'Calle de Serrano 72, Madrid',
		image: 'https://picsum.photos/seed/madrid-7/800/600',
		description: 'Elegant dining with seasonal tasting plates.',
		latlng: { lat: 40.4313, lng: -3.6877 },
		reviews: reviewSeeds.map((review) => ({ ...review, owner: ownerId }))
	},
	{
		name: 'Arguelles Cocina',
		owner: ownerId,
		address: 'Calle de Princesa 45, Madrid',
		image: 'https://picsum.photos/seed/madrid-8/800/600',
		description: 'Family kitchen with classic Madrid recipes.',
		latlng: { lat: 40.4298, lng: -3.7195 },
		reviews: reviewSeeds.map((review) => ({ ...review, owner: ownerId }))
	},
	{
		name: 'Atocha Grill',
		owner: ownerId,
		address: 'Ronda de Atocha 12, Madrid',
		image: 'https://picsum.photos/seed/madrid-9/800/600',
		description: 'Grilled plates and shared dishes near Atocha station.',
		latlng: { lat: 40.4066, lng: -3.6918 },
		reviews: reviewSeeds.map((review) => ({ ...review, owner: ownerId }))
	},
	{
		name: 'Chamartin Deli',
		owner: ownerId,
		address: 'Calle de Agustin de Foxa 3, Madrid',
		image: 'https://picsum.photos/seed/madrid-10/800/600',
		description: 'Fast lunches and deli classics for commuters.',
		latlng: { lat: 40.4722, lng: -3.6837 },
		reviews: reviewSeeds.map((review) => ({ ...review, owner: ownerId }))
	}
];

export const seedChallengeData = async (): Promise<void> => {
	const admin = await UserModel.create(adminUserSeed);
	const restaurants = buildRestaurants(admin._id as Types.ObjectId);

	await RestaurantModel.insertMany(restaurants);
};

const run = async (): Promise<void> => {
	await MongoConnection.open();

	try {
		await seedChallengeData();
		console.info('Seed completed.');
	} catch (error) {
		console.error('Seed failed:', error);
	} finally {
		await MongoConnection.close();
	}
};

if (require.main === module) {
	run().catch((error) => {
		console.error('Seed failed:', error);
	});
}
