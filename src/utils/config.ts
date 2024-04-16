import { load } from 'https://deno.land/std@0.222.1/dotenv/mod.ts';

const envFile = await load();

Deno.env.set('DATABASE_URL', envFile['DATABASE_URL']);
Deno.env.set('EMAIL_API_KEY', envFile['EMAIL_API_KEY']);
Deno.env.set('AUTH_SECRET', envFile['AUTH_SECRET']);
Deno.env.set('KINDE_SECRET', envFile['KINDE_SECRET']);
Deno.env.set('KINDE_CLIENT_ID', envFile['KINDE_CLIENT_ID']);
Deno.env.set('KINDE_DOMAIN', envFile['KINDE_DOMAIN']);
Deno.env.set('UPSTASH_TOKEN', envFile['UPSTASH_TOKEN']);
Deno.env.set('UPSTASH_URL', envFile['UPSTASH_URL']);

export const env = {
	DATABASE_URL: Deno.env.get('DATABASE_URL') || '',
	EMAIL_API_KEY: Deno.env.get('EMAIL_API_KEY') || '',
	AUTH_SECRET: Deno.env.get('AUTH_SECRET') || '',
	KINDE_SECRET: Deno.env.get('KINDE_SECRET') || '',
	KINDE_CLIENT_ID: Deno.env.get('KINDE_CLIENT_ID') || '',
	KINDE_DOMAIN: Deno.env.get('KINDE_DOMAIN') || '',
	UPSTASH_TOKEN: Deno.env.get('UPSTASH_TOKEN') || '',
	UPSTASH_URL: Deno.env.get('UPSTASH_URL') || '',
};
