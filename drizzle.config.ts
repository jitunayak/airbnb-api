import type { Config } from 'drizzle-kit';

import dotenv from 'dotenv';
dotenv.config({ path: '.dev.vars' });

export default {
	schema: './src/db/schema.ts',
	out: './drizzle',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.DATABASE_URL as string,
	},
	verbose: true,
	strict: true,
} satisfies Config;
