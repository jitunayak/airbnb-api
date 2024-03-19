import { Hono } from 'hono';
import { usersRoute } from './routes/users';
import { wishlistsRoutes } from './routes/wishlists';
export type Env = {
	DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();
const routes = new Hono<{ Bindings: Env }>();

routes.route('/wishlists', wishlistsRoutes);
routes.route('/users', usersRoute);

app.route('/api/v1', routes);

export default app;
