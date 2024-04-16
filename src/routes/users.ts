import { Router } from 'https://deno.land/x/oak@v12.5.0/router.ts';
import { Pool } from 'npm:@neondatabase/serverless';
import { eq } from 'npm:drizzle-orm';
import { drizzle } from 'npm:drizzle-orm/neon-serverless';
import { ZodError } from 'npm:zod';
import { insertUserSchema, users, wishlists } from '../db/schema.ts';
import { env } from '../utils/config.ts';
import { handlerError } from '../utils/util.ts';

export const usersRoute = new Router({ prefix: '/api/v1/users' });

usersRoute.get('/', async (c) => {
	const client = new Pool({ connectionString: env.DATABASE_URL });
	const db = drizzle(client);
	const result = await db.select().from(users);
	c.response.body = {
		count: result.length,
		data: result,
	};
});

usersRoute.get('/:id', async (c) => {
	try {
		const client = new Pool({ connectionString: env.DATABASE_URL });
		const db = drizzle(client);
		const result = await db.select().from(users).where(eq(users.id, c.params.id));
		if (result.length === 0) {
			c.throw(404, 'User not found');
		}
		c.response.body = result[0];
		return;
	} catch (error) {
		handlerError(error);
	}
});

usersRoute.post('', async (c) => {
	try {
		const body = await c.request.body().value;
		const { name, email, id } = insertUserSchema.parse(body);
		const client = new Pool({ connectionString: env.DATABASE_URL });
		const db = drizzle(client);
		const result = await db.insert(users).values({ createdAt: new Date().toISOString(), email, name, id }).returning();
		c.response.body = result[0];
		return;
	} catch (error) {
		if (error instanceof ZodError) {
			c.response.body = JSON.stringify({ error: error.issues });
			c.response.status = 400;
			return;
		}
		handlerError(error);
	}
});

usersRoute.get('/:id/wishlists', async (c) => {
	try {
		const client = new Pool({ connectionString: env.DATABASE_URL });
		const db = drizzle(client);
		const wishLists = await db.select().from(wishlists).where(eq(wishlists.userId, c.params.id));
		c.response.body = {
			count: wishLists.length,
			data: wishLists,
		};
		return;
	} catch (error) {
		handlerError(error);
	}
});
