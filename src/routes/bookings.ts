import { desc, eq } from 'drizzle-orm';
import express from 'express';
import { bookings } from '../db/schema';
import { sendBookingConfirmationEmail } from '../email/bookingConfirmation';
import { env } from '../utils/config';
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
		orderBy: [desc(bookings.checkIn)],
	});

	res.json(allBookings);
});

bookingsRoute.post('/', async (req, res) => {
	const { userId, roomId, checkInDate, checkOutDate, price, currency, email } = req.body;
	const id = crypto.randomUUID();
	const result = await db.insert(bookings).values({
		id,
		userId: userId,
		roomId: roomId,
		currency: currency,
		checkIn: checkInDate,
		checkOut: checkOutDate,
		price: price,
		status: 'pending',
		createdAt: new Date().toISOString(),
		modifiedAt: new Date().toISOString(),
	});

	await sendBookingConfirmationEmail({
		to: email,
		name: email.split('@')[0],
		apiKey: env.EMAIL_API_KEY,
		bookingId: id,
		checkInDate: checkInDate,
		checkOutDate: checkOutDate,
	});

	res.status(201).json(result);
});
