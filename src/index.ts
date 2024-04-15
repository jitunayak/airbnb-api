import { Hono } from 'hono';
import { config } from 'https://deno.land/x/dotenv@v3.1.0/mod.ts';
import { emailsRoute, usersRoute, wishlistsRoutes } from './routes/index.ts';

config({ export: true });
export type Env = {
	DATABASE_URL: string;
	EMAIL_API_KEY: string;
};
const PORT = (Deno.env.get('PORT') as unknown as number) || 8787;

const app = new Hono<{ Bindings: Env }>().basePath('/api/v1');

app.route('/wishlists', wishlistsRoutes);
app.route('/users', usersRoute);
app.route('/emails', emailsRoute);

console.log(`Server is running on port ${PORT} 🔥`);
Deno.serve(app.fetch);
Deno.serve({ port: PORT }, app.fetch);

export default app;
