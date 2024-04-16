import { load } from 'https://deno.land/std@0.222.1/dotenv/mod.ts';

const envFile = await load();

export const env = {
	DATABASE_URL: envFile['DATABASE_URL'] || Deno.env.get('DATABASE_URL') || '',
	EMAIL_API_KEY: envFile['EMAIL_API_KEY'] || Deno.env.get('EMAIL_API_KEY') || '',
	AUTH_SECRET: envFile['AUTH_SECRET'] || Deno.env.get('AUTH_SECRET') || '',
	KINDE_SECRET: envFile['KINDE_SECRET'] || Deno.env.get('KINDE_SECRET') || '',
	KINDE_CLIENT_ID: envFile['KINDE_CLIENT_ID'] || Deno.env.get('KINDE_CLIENT_ID') || '',
	KINDE_DOMAIN: envFile['KINDE_DOMAIN'] || Deno.env.get('KINDE_DOMAIN') || '',
};
