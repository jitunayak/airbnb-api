import { config } from 'dotenv';
config();

interface Env {
	DATABASE_URL: string;
	EMAIL_API_KEY: string;
	AUTH_SECRET: string;
	KINDE_SECRET: string;
	KINDE_CLIENT_ID: string;
	KINDE_DOMAIN: string;
	UPSTASH_TOKEN: string;
	UPSTASH_URL: string;
}

export const env: Env = {
	DATABASE_URL: process.env.DATABASE_URL as string,
	EMAIL_API_KEY: process.env.EMAIL_API_KEY as string,
	AUTH_SECRET: process.env.AUTH_SECRET as string,
	KINDE_SECRET: process.env.KINDE_SECRET as string,
	KINDE_CLIENT_ID: process.env.KINDE_CLIENT_ID as string,
	KINDE_DOMAIN: process.env.KINDE_DOMAIN as string,
	UPSTASH_TOKEN: process.env.UPSTASH_TOKEN as string,
	UPSTASH_URL: process.env.UPSTASH_URL as string,
};
