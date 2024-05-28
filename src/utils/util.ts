import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as express from 'express';
import { Router } from 'express';
import * as schema from '../db/schema';
export const handlerError = (req: express.Request, res: express.Response, err: Error) => {
	console.log(err);
	const error = new Error(err.message);
	res.status(('status' in error && error.status) || 500).send({ message: error.message });
};

export const buildResultResponse = <T>(result: T[]) => ({
	count: result.length,
	data: result,
});

export const getDbClient = () => {
	const sql = neon(process.env.DATABASE_URL!);
	const db = drizzle(sql, { schema: schema });
	return db;
};

const app = Router();

export default app;
