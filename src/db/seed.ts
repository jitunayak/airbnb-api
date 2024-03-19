import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { users, wishlists } from './schema';

config({ path: '.dev.vars' });

const sql = neon(process.env.DATABASE_URL as string);

const db = drizzle(sql, {
	schema,
});

const main = async () => {
	try {
		console.log('Seeding database');
		// Delete all data
		await db.delete(wishlists);
		await db.delete(users);

		const userId = 'fada82b0-3101-42d3-9b7b-0b7b386a4c78';
		await db.insert(users).values([
			{
				id: userId,
				name: 'Alice Johnson',
				email: 'alice.johnson@example.com',
			},
		]);

		await db.insert(wishlists).values([
			{
				id: '1',
				userId,
				roomId: '12345',
			},
			{
				id: '2',
				userId,
				roomId: '67890',
			},
		]);
	} catch (error) {
		console.error(error);
		throw new Error('Failed to seed database');
	}
};

main();
