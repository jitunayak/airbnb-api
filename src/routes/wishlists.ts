import { Pool } from '@neondatabase/serverless';
import { and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Hono } from 'hono';
import { Env } from '..';
import { wishlists } from '../db/schema';
import { handlerError } from '../utils/util';

export const wishlistsRoutes = new Hono<{ Bindings: Env }>();

wishlistsRoutes.get('/', async (c) => {
	try {
		const client = new Pool({ connectionString: c.env.DATABASE_URL });
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
		const { userId, roomId } = await c.req.json();
		if (!userId || !roomId) {
			return c.json({ message: 'userId and roomId is required' });
		}
		const client = new Pool({ connectionString: c.env.DATABASE_URL });
		const db = drizzle(client);

		// check if user exists
		const alreadyWishlisted = await db
			.select()
			.from(wishlists)
			.where(and(eq(wishlists.userId, userId), eq(wishlists.roomId, roomId)));

		if (alreadyWishlisted.length > 0) {
			c.status(409);
			return c.json({ message: 'Already wishlisted' });
		}

		const result = await db
			.insert(wishlists)
			.values({
				userId: userId,
				roomId: roomId,
			})
			.returning();
		c.status(201);
		return c.json(result[0]);
	} catch (error) {
		handlerError(error);
	}
});

wishlistsRoutes.get('/:id', async (c) => {
	try {
		const client = new Pool({ connectionString: c.env.DATABASE_URL });
		const db = drizzle(client);
		const result = await db
			.select()
			.from(wishlists)
			.where(eq(wishlists.id, c.req.param('id')));
		if (result.length === 0) {
			c.status(404);
			return c.json({ message: 'Not found' });
		}
		return c.json(result[0]);
	} catch (error) {
		handlerError(error);
	}
});

wishlistsRoutes.delete('/:id', async (c) => {
	try {
		const client = new Pool({ connectionString: c.env.DATABASE_URL });
		const db = drizzle(client);
		const result = await db.delete(wishlists).where(eq(wishlists.id, c.req.param('id')));
		return c.json('removed from wishlist');
	} catch (error) {
		handlerError(error);
	}
});
