import { Pool } from '@neondatabase/serverless';
import { and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'npm:zod';
import { insertWishlistSchema, wishlists } from '../db/schema.ts';
import { Env } from '../index.ts';
import { config } from '../utils/config.ts';
import { handlerError } from '../utils/util.ts';

export const wishlistsRoutes = new Hono<{ Bindings: Env }>();

wishlistsRoutes.get('/', async (c) => {
	try {
		const client = new Pool({ connectionString: config.DATABASE_URL });
		const db = drizzle(client);
		const result = await db.select().from(wishlists);
		return c.json({
			count: result.length,
			data: result,
		});
	} catch (error) {
		handlerError(error);
	}
});

wishlistsRoutes.post('/', async (c) => {
	try {
		const body = await c.req.json();
		const { userId, roomId } = insertWishlistSchema.parse(body);
		const client = new Pool({ connectionString: config.DATABASE_URL });
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
		c.status(201);
		return c.json(result[0]);
	} catch (error) {
		if (error instanceof ZodError) {
			return c.json({ error: error.issues });
		}
		handlerError(error);
	}
});

wishlistsRoutes.get('/:id', async (c) => {
	try {
		const client = new Pool({ connectionString: config.DATABASE_URL });
		const db = drizzle(client);
		const result = await db
			.select()
			.from(wishlists)
			.where(eq(wishlists.id, c.req.param('id')));
		if (result.length === 0) {
			throw new HTTPException(404, { message: 'Not found' });
		}
		return c.json(result[0]);
	} catch (error) {
		handlerError(error);
	}
});

wishlistsRoutes.delete('/:id', async (c) => {
	try {
		const client = new Pool({ connectionString: config.DATABASE_URL });
		const db = drizzle(client);

		const result = await db.delete(wishlists).where(eq(wishlists.id, c.req.param('id')));
		return c.json('removed from wishlist');
	} catch (error) {
		handlerError(error);
	}
});
