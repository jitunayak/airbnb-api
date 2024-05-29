import dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config({ path: '.dev.vars' });

export default {
	schema: './src/db/schema.ts',
	out: './drizzle/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL as string,
	},
	verbose: true,
	strict: true,
} satisfies Config;
