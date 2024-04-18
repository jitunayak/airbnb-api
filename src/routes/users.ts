import { Router } from 'https://deno.land/x/oak@v12.5.0/router.ts';
import { eq } from 'npm:drizzle-orm';
import { ZodError } from 'npm:zod';
import { insertUserSchema, users, wishlists } from '../db/schema.ts';
import { buildResultResponse, getDbClient } from '../utils/util.ts';

export const usersRoute = new Router({ prefix: '/api/v1/users' });
const db = getDbClient();

usersRoute.get('/', async (c) => {
	const result = await db.select().from(users);
	buildResultResponse(c, result);
});

usersRoute.get('/:id', async (c) => {
	const result = await db.select().from(users).where(eq(users.id, c.params.id));
	if (result.length === 0) {
		c.throw(404, 'User not found');
	}
	c.response.body = result[0];
	return;
});

usersRoute.post('', async (c) => {
	try {
		const body = await c.request.body().value;
		const { name, email, id } = insertUserSchema.parse(body);
		const result = await db.insert(users).values({ createdAt: new Date().toISOString(), email, name, id }).returning();
		c.response.body = result[0];
		return;
	} catch (error) {
		if (error instanceof ZodError) {
			c.response.body = JSON.stringify({ error: error.issues });
			c.response.status = 400;
			return;
		}
		throw error;
	}
});

usersRoute.get('/:id/wishlists', async (c) => {
	const wishLists = await db.select().from(wishlists).where(eq(wishlists.userId, c.params.id));
	buildResultResponse(c, wishLists);
	return;
});
