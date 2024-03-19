import { Pool } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Hono } from 'hono';
import { ZodError } from 'zod';
import { Env } from '..';
import { insertUserSchema, users, wishlists } from '../db/schema';
import { handlerError } from '../utils/util';

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
		if (result.length === 0) {
			return c.status(404);
		}
		return c.json(result[0]);
	} catch (error) {
		handlerError(error);
	}
});

usersRoute.post('', async (c) => {
	try {
		const body = await c.req.json();
		const { name, email, id } = insertUserSchema.parse(body);
		const client = new Pool({ connectionString: c.env.DATABASE_URL });
		const db = drizzle(client);
		const result = await db.insert(users).values({ email, name, id }).returning();
		return c.json(result[0]);
	} catch (error) {
		if (error instanceof ZodError) {
			return c.json({ error: error.issues });
		}
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
