import { isHttpError } from 'https://deno.land/std@0.188.0/http/http_errors.ts';
import { Context } from 'https://deno.land/x/oak@v12.5.0/context.ts';
import { Pool } from 'npm:@neondatabase/serverless';
import { drizzle } from 'npm:drizzle-orm/neon-serverless/driver';
import { env } from './config.ts';

export const handlerError = (ctx: Context, error: Error) => {
	console.log(error);
	if (isHttpError(error)) {
		ctx.response.status = error.status;
		ctx.response.body = { message: error.message };
	}
	ctx.response.status = 500;
	ctx.response.body = error.message;
};

export const buildResultResponse = <T>(c: Context, result: T[]) => {
	c.response.body = {
		count: result.length,
		data: result,
	};
};
export const getDbClient = () => {
	const client = new Pool({ connectionString: env.DATABASE_URL });
	const db = drizzle(client);
	return db;
};
