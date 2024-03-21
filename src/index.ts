import { Hono } from 'hono';
import { emailsRoute, usersRoute, wishlistsRoutes } from './routes';
export type Env = {
	DATABASE_URL: string;
	EMAIL_API_KEY: string;
};

const app = new Hono<{ Bindings: Env }>().basePath('/api/v1');

app.route('/wishlists', wishlistsRoutes);
app.route('/users', usersRoute);
app.route('/emails', emailsRoute);

export default app;
