import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema';
import { bookings, images, prices, rooms, users, wishlists } from '../src/db/schema';

// config({ path: '.dev.vars' });

config();

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
				name: 'Saagar',
				email: 'saagar.biswal@gmail.com',
				picture: 'https://a0.muscache.com/im/pictures/user/47303143-f29b-404b-b333-77a56c4d016e.jpg?im_w=240',
				createdAt: new Date().toISOString(),
			},
		]);

		await db.insert(rooms).values([
			{
				id: '12345',
				userId,
				name: 'Lakeview PremiumRoom(Private Balcony): Alleppey',
				description: `Welcome to our serene Lakeview Room in Allepy!Nestled amidst lush greenery,our property offers breathtaking views of the backwaters. Wake up to the soothing sounds of nature&sip your Tea while admiring the picturesque scenery from your private balcony. Immerse yourself in the local culture with authentic Kerala cuisine prepared by our skilled chef.Whether you're seeking relaxation or adventure, our friendly staff is here to make your stay unforgettable. Book now & Experience the Magic Of Allepy.`,
				amenities: ['wifi', 'kitchen', 'Tv', 'Fridge'],
				listingUrl: 'https://www.airbnb.com/rooms/12345',
				thumbnail: 'https://example.com/room.jpg',
				address: 'Karnataka, India',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				propertyType: 'hotel',
				rating: '4.5',
				summary: 'Room in hotel in Kainakary South, India',
			},
			{
				id: '67890',
				userId,
				name: 'Luxury Private Suite Estate overlooking the sea',
				description: `Nestled to the south of Gokarna, along the picturesque coastline where the cliffs of the Western Ghats plunge into the Arabian Ocean, lies an unexplored expanse of beach and jungle. Here, where the ocean gently folds into an estuary lies a glimmer of paradise.
Perched atop the hills and affording 360º views of the contrasts of sea- and forest-scapes, It offers a world of quiet indulgence amidst nature.`,
				amenities: ['wifi', 'kitchen', 'Pool', 'Free Parking'],
				listingUrl: 'https://www.airbnb.com/rooms/67890',
				thumbnail: 'https://example.com/room.jpg',
				address: 'Gokarna, India',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				propertyType: 'suite',
				rating: '4.5',
				summary: 'Room in boutique hotel in Gokarna, India',
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

		await db.insert(images).values([
			{
				id: '1',
				roomId: '12345',
				url: 'https://a0.muscache.com/im/pictures/miso/Hosting-31049657/original/37d0a827-358b-4551-859b-e6a64c8e7f1d.jpeg?im_w=720',
				createdAt: new Date().toISOString(),
			},
			{
				id: '2',
				roomId: '12345',
				url: 'https://a0.muscache.com/im/pictures/miso/Hosting-31049657/original/5b2f9870-23bc-4cc4-b93d-cf8946b8b929.jpeg?im_w=720',
				createdAt: new Date().toISOString(),
			},
			{
				id: '8',
				roomId: '12345',
				url: 'https://a0.muscache.com/im/pictures/27013fec-93f9-4250-b9b6-0004a3f6aefb.jpg?im_w=1200',
				createdAt: new Date().toISOString(),
			},
			{
				id: '3',
				roomId: '12345',
				url: 'https://a0.muscache.com/im/pictures/miso/Hosting-31049657/original/f7cf2a5e-1ef3-4f46-b3bd-8b9afaec2b71.jpeg?im_w=720',
				createdAt: new Date().toISOString(),
			},
			{
				id: '4',
				roomId: '67890',
				url: 'https://a0.muscache.com/im/pictures/1d9c40a4-385c-4682-8f98-03a5c8cdd5bd.jpg?im_w=1200',
				createdAt: new Date().toISOString(),
			},
			{
				id: '5',
				roomId: '67890',
				url: 'https://a0.muscache.com/im/pictures/71303974-34a8-4952-875e-af6f24860f65.jpg?im_w=720',
				createdAt: new Date().toISOString(),
			},
			{
				id: '6',
				roomId: '67890',
				url: 'https://a0.muscache.com/im/pictures/7410e944-d260-401b-86e4-af19858701a0.jpg?im_w=720',
				createdAt: new Date().toISOString(),
			},
			{
				id: '7',
				roomId: '67890',
				url: 'https://a0.muscache.com/im/pictures/ec1f1d85-af62-4d04-aeba-4d37384333ee.jpg?im_w=720',
				createdAt: new Date().toISOString(),
			},
		]);

		await db.insert(prices).values([
			{
				id: '1',
				roomId: '12345',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				discountedPrice: '5000',
				originalPrice: '8900',
				serviceCharge: '300',
			},
			{
				id: '2',
				roomId: '67890',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				discountedPrice: '3000',
				originalPrice: '600',
				serviceCharge: '200',
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
