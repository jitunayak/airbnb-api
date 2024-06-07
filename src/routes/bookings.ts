import { eq } from 'drizzle-orm';
import express from 'express';
import { bookings } from '../db/schema';
import { getDbClient } from '../utils/util';

export const bookingsRoute = express.Router();
const db = getDbClient();

bookingsRoute.get('/', async (req, res) => {
	const userId = req.query.userId as string;
	if (!userId) {
		return res.status(400).send('Missing userId');
	}

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
			images: {
				columns: {
					createdAt: false,
				},
			},
			user: {
				columns: {
					createdAt: false,
				},
			},
		},
	});

	res.json(allBookings);
});
