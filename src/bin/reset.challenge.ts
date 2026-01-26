import 'dotenv/config';
import '../loaders/log.loader';
import { MongoConnection } from '../loaders/db.loader';
import { UserModel } from '../model/user.model';
import { RestaurantModel } from '../model/restaurant.model';
import { BlackListModel } from '../model/black_list.model';
import { seedChallengeData } from './seed.challenge';

const run = async (): Promise<void> => {
	await MongoConnection.open();

	try {
		await Promise.all([
			UserModel.deleteMany({}),
			RestaurantModel.deleteMany({}),
			BlackListModel.deleteMany({})
		]);

		await seedChallengeData();
		console.info('Reset and seed completed.');
	} catch (error) {
		console.error('Reset failed:', error);
	} finally {
		await MongoConnection.close();
	}
};

if (require.main === module) {
	run().catch((error) => {
		console.error('Reset failed:', error);
	});
}
