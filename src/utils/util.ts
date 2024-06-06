import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import * as express from 'express';
import { Router } from 'express';
import * as schema from '../db/schema';

config();
export const handlerError = (req: express.Request, res: express.Response, err: Error) => {
	console.log(err);
	const error = new Error(err.message);
	res.status('status' in error ? (error.status as number) : 500).send({ message: error.message });
};

export const buildResultResponse = <T>(result: T[]) => ({
	count: result.length,
	data: result,
});

export const getDbClient = () => {
	const sql = neon(process.env.DATABASE_URL as string);
	const db = drizzle(sql, { schema: schema });
	return db;
};

const app = Router();

export default app;
