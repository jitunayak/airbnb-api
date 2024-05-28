import { and, eq } from 'drizzle-orm';
import express from 'express';
import { Conflict, NotFound } from 'http-errors';
import { ZodError } from 'zod';
import { insertWishlistSchema, wishlists } from '../db/schema';
import { buildResultResponse, getDbClient } from '../utils/util';
const db = getDbClient();

export const wishlistsRoute = express.Router();

wishlistsRoute.get('/', async (req, res) => {
	const result = await db.select().from(wishlists);
	res.json(buildResultResponse(result));
});

wishlistsRoute.post('/', async (req, res) => {
	try {
		const body = req.body;
		const { userId, roomId } = insertWishlistSchema.parse(body);
		// check if user exists
		const alreadyWishlisted = await db
			.select()
			.from(wishlists)
			.where(and(eq(wishlists.userId, userId), eq(wishlists.roomId, roomId)));

		if (alreadyWishlisted.length > 0) {
			throw Conflict('Already wishlisted');
		}

		const result = await db
			.insert(wishlists)
			.values({
				id: crypto.randomUUID(),
				userId: userId,
				roomId: roomId,
				createdAt: new Date().toISOString(),
			})
			.returning();
		res.status(201).json(result[0]);
	} catch (error) {
		if (error instanceof ZodError) {
			res.status(400).json({ error: error.issues });
			return;
		}
		throw error;
	}
});

wishlistsRoute.get('/:id', async (req, res) => {
	const result = await db.select().from(wishlists).where(eq(wishlists.id, req.params.id));
	if (result.length === 0) {
		throw NotFound('Not found');
	}
	res.json(result[0]);
});

wishlistsRoute.delete('/:id', async (req, res) => {
	const result = await db.delete(wishlists).where(eq(wishlists.id, req.params.id));
	console.log(result);
	res.json('removed from wishlists');
});
