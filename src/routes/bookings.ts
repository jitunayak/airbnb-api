import { eq } from 'drizzle-orm';
import express from 'express';
import { bookings, images } from '../db/schema';
import { getDbClient } from '../utils/util';

export const bookingsRoute = express.Router();
const db = getDbClient();

bookingsRoute.get('/', async (req, res) => {
	const userId = req.query.userId as string;
	if (!userId) {
		return res.status(400).send('Missing userId');
	}

	// const result = await db
	// 	.select()
	// 	.from(bookings)
	// 	.leftJoin(rooms, eq(bookings.roomId, rooms.id))
	// 	.leftJoin(images, eq(rooms.id, images.roomId))
	// 	.leftJoin(users, eq(bookings.userId, users.id));

	const allBookings = await db.query.bookings.findMany({
		where: eq(bookings.userId, userId),
		columns: {
			createdAt: false,
			modifiedAt: false,
		},
		with: {
			room: {
				columns: {
					createdAt: false,
					updatedAt: false,
				},
			},
		},
	});

	const roomImages = await Promise.all(allBookings.map((booking) => db.select().from(images).where(eq(images.roomId, booking.room.id))));

	const result = allBookings.map((booking, index) => {
		return {
			...booking,
			room: {
				...booking.room,
				images: roomImages[index],
			},
		};
	});

	res.json(result);
});
