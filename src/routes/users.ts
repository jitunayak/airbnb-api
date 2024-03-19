import { Pool } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Hono } from 'hono';
import { Env } from '..';
import { users, wishlists } from '../db/schema';
import { handlerError } from '../util';

export const usersRoute = new Hono<{ Bindings: Env }>();

usersRoute.get('', async (c) => {
	try {
		const client = new Pool({ connectionString: c.env.DATABASE_URL });
		const db = drizzle(client);
		const result = await db.select().from(users);
		return c.json({
			count: result.length,
			data: result,
		});
	} catch (error) {
		handlerError(error);
	}
});

usersRoute.get('/:id', async (c) => {
	try {
		const client = new Pool({ connectionString: c.env.DATABASE_URL });
		const db = drizzle(client);
		const result = await db
			.select()
			.from(users)
			.where(eq(users.id, c.req.param('id')));

		return c.json(result[0]);
	} catch (error) {
		handlerError(error);
	}
});

usersRoute.get('/:id/wishlists', async (c) => {
	try {
		const client = new Pool({ connectionString: c.env.DATABASE_URL });
		const db = drizzle(client);
		const wishLists = await db
			.select()
			.from(wishlists)
			.where(eq(wishlists.userId, c.req.param('id')));
		return c.json({
			count: wishLists.length,
			data: wishLists,
		});
	} catch (error) {
		handlerError(error);
	}
});
