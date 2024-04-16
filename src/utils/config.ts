import { config } from 'npm:dotenv';
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
	DATABASE_URL: Deno.env.get('DATABASE_URL') as string,
	EMAIL_API_KEY: Deno.env.get('EMAIL_API_KEY') as string,
	AUTH_SECRET: Deno.env.get('AUTH_SECRET') as string,
	KINDE_SECRET: Deno.env.get('KINDE_SECRET') as string,
	KINDE_CLIENT_ID: Deno.env.get('KINDE_CLIENT_ID') as string,
	KINDE_DOMAIN: Deno.env.get('KINDE_DOMAIN') as string,
	UPSTASH_TOKEN: Deno.env.get('UPSTASH_TOKEN') as string,
	UPSTASH_URL: Deno.env.get('UPSTASH_URL') as string,
};
