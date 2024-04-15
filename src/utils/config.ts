import { load } from 'https://deno.land/std@0.222.1/dotenv/mod.ts';

const env = await load();

export const config = {
	DATABASE_URL: env['DATABASE_URL'] || Deno.env.get('DATABASE_URL') || '',
	EMAIL_API_KEY: env['EMAIL_API_KEY'] || Deno.env.get('EMAIL_API_KEY') || '',
};
