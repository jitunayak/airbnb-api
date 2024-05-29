import { eq } from 'drizzle-orm';
import express from 'express';
import { images, rooms } from '../db/schema';
import { getDbClient } from './../utils/util';
export const roomsRoute = express.Router();
const db = getDbClient();

roomsRoute.get('/', async (req, res) => {
	// select().from(rooms).leftJoin(prices, eq(rooms.id, prices.roomId));
	const result = await db.query.rooms.findMany({
		columns: {
			updatedAt: false,
			createdAt: false,
		},
		with: {
			images: { columns: { roomId: false, createdAt: false } },
			price: {
				columns: {
					roomId: false,
					createdAt: false,
					updatedAt: false,
				},
			},
		},
	});
	res.json(result);
});

roomsRoute.get('/:id', async (req, res) => {
	// const result = await db.select().from(rooms).where(eq(rooms.id, req.params.id));
	const result = await db.query.rooms.findFirst({
		where: eq(rooms.id, req.params.id),
		columns: {
			updatedAt: false,
			createdAt: false,
		},
		with: {
			user: { columns: { createdAt: false } },
			images: { columns: { roomId: false, createdAt: false } },
			price: {
				columns: {
					roomId: false,
					createdAt: false,
					updatedAt: false,
				},
			},
		},
	});

	if (result === null) {
		res.status(404).send('Room not found');
	}
	res.json(result);
});

roomsRoute.get('/:id/images', async (req, res) => {
	const result = await db.select().from(images).where(eq(images.roomId, req.params.id));
	if (result.length === 0) {
		res.status(404).send('Room not found');
	}
	res.json(result);
});
