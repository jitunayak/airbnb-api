import { Router } from 'https://deno.land/x/oak@v12.5.0/router.ts';
import { Pool } from 'npm:@neondatabase/serverless';
import { and, eq } from 'npm:drizzle-orm';
import { drizzle } from 'npm:drizzle-orm/neon-serverless';
import { HTTPException } from 'npm:hono/http-exception';
import { ZodError } from 'npm:zod';
import { insertWishlistSchema, wishlists } from '../db/schema.ts';
import { env } from '../utils/config.ts';
import { handlerError } from '../utils/util.ts';

export const wishlistsRoutes = new Router({ prefix: '/api/v1/wishlists' });

wishlistsRoutes.get('/', async (c) => {
	try {
		const client = new Pool({ connectionString: env.DATABASE_URL });
		const db = drizzle(client);
		const result = await db.select().from(wishlists);
		c.response.body = {
			count: result.length,
			data: result,
		};
	} catch (error) {
		handlerError(error);
	}
});

wishlistsRoutes.post('/', async (c) => {
	try {
		const body = c.request.body().value;
		const { userId, roomId } = insertWishlistSchema.parse(body);
		const client = new Pool({ connectionString: env.DATABASE_URL });
		const db = drizzle(client);

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
				id: '000-' + new Date().getTime(),
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
		handlerError(error);
	}
});

wishlistsRoutes.get('/:id', async (c) => {
	try {
		const client = new Pool({ connectionString: env.DATABASE_URL });
		const db = drizzle(client);
		const result = await db.select().from(wishlists).where(eq(wishlists.id, c.params.id));
		if (result.length === 0) {
			throw new HTTPException(404, { message: 'Not found' });
		}
		c.response.body = result[0];
		return;
	} catch (error) {
		handlerError(error);
	}
});

wishlistsRoutes.delete('/:id', async (c) => {
	try {
		const client = new Pool({ connectionString: env.DATABASE_URL });
		const db = drizzle(client);
		const result = await db.delete(wishlists).where(eq(wishlists.id, c.params.id));
		console.log(result);
		c.response.body = 'removed from wishlists';
		return;
	} catch (error) {
		handlerError(error);
	}
});
