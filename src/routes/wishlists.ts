import { Router } from 'https://deno.land/x/oak@v12.5.0/router.ts';
import { and, eq } from 'npm:drizzle-orm';
import { HTTPException } from 'npm:hono/http-exception';
import { ZodError } from 'npm:zod';
import { insertWishlistSchema, wishlists } from '../db/schema.ts';
import { buildResultResponse, getDbClient } from '../utils/util.ts';

export const wishlistsRoutes = new Router({ prefix: '/api/v1/wishlists' });
const db = getDbClient();

wishlistsRoutes.get('/', async (c) => {
	const result = await db.select().from(wishlists);
	buildResultResponse(c, result);
});

wishlistsRoutes.post('/', async (c) => {
	try {
		const body = c.request.body().value;
		const { userId, roomId } = insertWishlistSchema.parse(body);
		// check if user exists
		const alreadyWishlisted = await db
			.select()
			.from(wishlists)
			.where(and(eq(wishlists.userId, userId), eq(wishlists.roomId, roomId)));

		if (alreadyWishlisted.length > 0) {
			throw new HTTPException(409, { message: 'Already wishlisted' });
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
		c.response.body = result[0];
		c.response.status = 201;
		return;
	} catch (error) {
		if (error instanceof ZodError) {
			c.response.body = JSON.stringify({ error: error.issues });
			return;
		}
		throw error;
	}
});

wishlistsRoutes.get('/:id', async (c) => {
	const result = await db.select().from(wishlists).where(eq(wishlists.id, c.params.id));
	if (result.length === 0) {
		throw new HTTPException(404, { message: 'Not found' });
	}
	c.response.body = result[0];
	return;
});

wishlistsRoutes.delete('/:id', async (c) => {
	const result = await db.delete(wishlists).where(eq(wishlists.id, c.params.id));
	console.log(result);
	c.response.body = 'removed from wishlists';
	return;
});
