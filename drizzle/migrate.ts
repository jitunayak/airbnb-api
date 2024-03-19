import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
config({ path: '.dev.vars' });
const sql = neon(process.env.DATABASE_URL as string);

const db = drizzle(sql);

const main = async () => {
	try {
		await migrate(db, {
			migrationsFolder: './drizzle/migrations',
		});

		console.log('Migration successful');
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

main();
