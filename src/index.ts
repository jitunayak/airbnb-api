import { config } from 'https://deno.land/x/dotenv@v3.1.0/mod.ts';
import { Application } from 'https://deno.land/x/oak@v12.5.0/application.ts';
import { emailsRoute, usersRoute, wishlistsRoutes } from './routes/index.ts';
import { verifyToken } from './utils/authUtils.ts';

config({ export: true });
export type Env = {
	DATABASE_URL: string;
	EMAIL_API_KEY: string;
};
const PORT = Deno.env.get('PORT') as unknown as number;

const app = new Application();

app.use(verifyToken);
app.use(wishlistsRoutes.routes());
app.use(wishlistsRoutes.allowedMethods());

app.use(usersRoute.routes());
app.use(usersRoute.allowedMethods());

app.use(emailsRoute.routes());
app.use(emailsRoute.allowedMethods());

console.log(`Server is running on port ${PORT} 🔥`);
app.listen({ port: PORT });

export default app;
