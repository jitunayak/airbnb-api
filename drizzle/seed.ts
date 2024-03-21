import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema';
import { bookings, rooms, users, wishlists } from '../src/db/schema';

config({ path: '.dev.vars' });

const sql = neon(process.env.DATABASE_URL as string);

const db = drizzle(sql, {
	schema,
});

const main = async () => {
	try {
		console.log('Seeding database');
		// Delete all data
		await db.delete(bookings);
		await db.delete(wishlists);
		await db.delete(rooms);
		await db.delete(users);

		const userId = 'fada82b0-3101-42d3-9b7b-0b7b386a4c78';
		await db.insert(users).values([
			{
				id: userId,
				name: 'Alice Johnson',
				email: 'alice.johnson@example.com',
				createdAt: new Date().toISOString(),
			},
		]);

		await db.insert(rooms).values([
			{
				id: '12345',
				name: 'Room 1',
				basePrice: '100',
				currency: 'USD',
				description: 'This is room 1',
				userId: userId,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			{
				id: '67890',
				name: 'Room 2',
				basePrice: '200',
				currency: 'USD',
				description: 'This is room 2',
				userId: userId,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
		]);

		await db.insert(wishlists).values([
			{
				id: '1',
				roomId: '12345',
				userId,
				createdAt: new Date().toISOString(),
			},
			{
				id: '2',
				roomId: '67890',
				userId,
				createdAt: new Date().toISOString(),
			},
		]);

		await db.insert(schema.images).values([
			{
				id: '1',
				roomId: '12345',
				url: 'https://example.com/image1.jpg',
				createdAt: new Date().toISOString(),
			},
		]);

		await db.insert(bookings).values([
			{
				id: '1',
				roomId: '12345',
				userId,
				checkIn: '2022-01-01',
				checkOut: '2022-01-02',
				status: 'confirmed',
				price: '100',
				currency: 'INR',
				createdAt: new Date().toISOString(),
			},
		]);
	} catch (error) {
		console.error(error);
		throw new Error('Failed to seed database');
	}
};

main();
