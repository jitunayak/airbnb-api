import { Pool } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
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

wishlistsRoutes.get('/:id', async (c) => {
	try {
		const client = new Pool({ connectionString: c.env.DATABASE_URL });
		const db = drizzle(client);
		const result = await db
			.select()
			.from(wishlists)
			.where(eq(wishlists.id, c.req.param('id')));
		if (result.length === 0) {
			return c.status(404);
		}
		return c.json(result[0]);
	} catch (error) {
		handlerError(error);
	}
});
