import { Hono } from 'hono';
import { usersRoute, wishlistsRoutes } from './routes';
export type Env = {
	DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>().basePath('/api/v1');

app.route('/wishlists', wishlistsRoutes);
app.route('/users', usersRoute);

export default app;
