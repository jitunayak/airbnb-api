import { eq } from 'drizzle-orm';
import express from 'express';
import { ZodError } from 'zod';
import { insertUserSchema, users, wishlists } from '../db/schema.ts';
import { buildResultResponse, getDbClient } from '../utils/util.ts';

export const usersRoute = express.Router();

const db = getDbClient();

usersRoute.get('/', async (req, res) => {
	const result = await db.select().from(users);
	res.json(buildResultResponse(result));
});

usersRoute.get('/:id', async (req, res) => {
	const result = await db.select().from(users).where(eq(users.id, req.params.id));
	if (result.length === 0) {
		return res.status(404).send('User not found');
	}
	res.json(result[0]);
});

usersRoute.post('', async (req, res) => {
	try {
		const body = req.body;
		const { name, email, id } = insertUserSchema.parse(body);
		const result = await db.insert(users).values({ createdAt: new Date().toISOString(), email, name, id }).returning();
		res.json(result[0]);
	} catch (error) {
		if (error instanceof ZodError) {
			res.status(400).json({ error: error.issues });
			return;
		}
		throw error;
	}
});

usersRoute.get('/:id/wishlists', async (req, res) => {
	const wishLists = await db.select().from(wishlists).where(eq(wishlists.userId, req.params.id));
	res.json(buildResultResponse(wishLists));
});

export default usersRoute;
