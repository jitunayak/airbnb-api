import { eq } from 'drizzle-orm';
import express from 'express';
import { ZodError } from 'zod';
import { IRoom, images, prices, rooms } from '../db/schema';
import { IRoomInputSchema } from '../schemas/RoomSchema';
import { verifyToken } from '../utils/authUtils';
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
		offset: req.query.offset ? Number(req.query.offset) : 0,
		limit: req.query.limit ? Number(req.query.limit) : 10,
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

roomsRoute.post('/', verifyToken, async (req, res) => {
	try {
		const body = req.body;

		if (!body) {
			throw new Error('Body is empty');
		}
		const roomInput = IRoomInputSchema.parse(body);
		const { name, description, address, price, userId, images: listingImages, propertyType, amenities, summary } = roomInput;
		const room: IRoom = {
			address,
			name,
			description,
			userId,
			amenities,
			listingUrl: '',
			thumbnail: '',
			rating: '5.0',
			createdAt: new Date().toISOString(),
			summary,
			id: crypto.randomUUID(),
			updatedAt: new Date().toISOString(),
			propertyType,
		};
		const roomRecord = (await db.insert(rooms).values(room).returning()).at(0);

		if (!roomRecord) {
			throw new Error('Room not created');
		}

		const priceRecord = await db.insert(prices).values({
			originalPrice: price,
			discountedPrice: price,
			serviceCharge: String(Number(price) * 0.1),
			roomId: roomRecord.id,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			id: crypto.randomUUID(),
		});

		if (!priceRecord) {
			throw new Error('Price not created');
		}

		for (const image of listingImages) {
			await db.insert(images).values({
				roomId: roomRecord.id,
				url: image,
				createdAt: new Date().toISOString(),
				id: crypto.randomUUID(),
			});
		}

		return res.json(roomRecord);
	} catch (error) {
		console.log(error);
		if (error instanceof ZodError) {
			res.status(400).json({ error: error.issues });
			return;
		}
		throw error;
	}
});
