import request from 'supertest';
import { app } from '../../app';
import { MongoConnection } from '../../loaders/db.loader';
import { BlackListModel } from '../../model/black_list.model';
import { RestaurantModel } from '../../model/restaurant.model';
import { UserModel } from '../../model/user.model';

jest.setTimeout(30000);

const buildAuthToken = async (): Promise<string> => {
	const email = `test-${Date.now()}@example.com`;
	const password = '12345678';
	const name = 'Test User';

	await request(app).post('/api/auth/signup').send({ email, password, name }).expect(201);

	const loginResponse = await request(app)
		.post('/api/auth/login')
		.send({ email, password })
		.expect(200);

	return loginResponse.body.token as string;
};

describe('API integration', () => {
	beforeAll(async () => {
		await MongoConnection.open();
	});

	afterAll(async () => {
		await MongoConnection.close();
	});

	beforeEach(async () => {
		await Promise.all([
			UserModel.deleteMany({}),
			RestaurantModel.deleteMany({}),
			BlackListModel.deleteMany({})
		]);
	});

	it('auth flow returns a valid token and user payload', async () => {
		const token = await buildAuthToken();
		expect(token).toBeTruthy();

		const verifyResponse = await request(app)
			.get('/api/auth/verify')
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(verifyResponse.body).toHaveProperty('_id');
	});

	it('creates, lists, and updates restaurants', async () => {
		const token = await buildAuthToken();
		const createPayload = {
			name: `Cafe Norte ${Date.now()}`,
			address: 'Calle Mayor 10, Madrid',
			image: 'https://picsum.photos/seed/test/800/600',
			description: 'Cozy place for brunch and local pastries.',
			latlng: { lat: 40.4168, lng: -3.7038 }
		};

		await request(app)
			.post('/api/restaurant/create')
			.set('Authorization', `Bearer ${token}`)
			.send(createPayload)
			.expect(201);

		const listResponse = await request(app).get('/api/restaurant/list').expect(200);

		expect(listResponse.body).toHaveProperty('restaurantList');
		expect(listResponse.body).toHaveProperty('total');
		expect(listResponse.body.restaurantList.length).toBe(1);
		expect(listResponse.body.restaurantList[0]).toHaveProperty('avgRating');

		const restaurantId = listResponse.body.restaurantList[0]._id as string;

		await request(app)
			.put(`/api/restaurant/${restaurantId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ description: 'Updated description for the restaurant.' })
			.expect(202);
	});

	it('creates a presigned upload URL', async () => {
		const token = await buildAuthToken();

		const response = await request(app)
			.post('/api/upload/presign')
			.set('Authorization', `Bearer ${token}`)
			.send({ contentType: 'image/jpeg', sizeBytes: 1024 })
			.expect(200);

		expect(response.body).toHaveProperty('uploadUrl');
		expect(response.body).toHaveProperty('publicUrl');
		expect(response.body).toHaveProperty('objectKey');
	});
});
