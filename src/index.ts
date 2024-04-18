import { config } from 'https://deno.land/x/dotenv@v3.1.0/mod.ts';
import { Application } from 'https://deno.land/x/oak@v12.5.0/application.ts';
import { emailsRoute, usersRoute, wishlistsRoutes } from './routes/index.ts';
import { verifyToken } from './utils/authUtils.ts';
import { rateLimiter } from './utils/rateLimiter.ts';
import { handlerError } from './utils/util.ts';

config({ export: true });

const PORT = Deno.env.get('PORT') as unknown as number;

const app = new Application();

app.use(async (ctx, next) => {
	try {
		await next();
	} catch (error) {
		handlerError(ctx, error);
	}
});

app.use(verifyToken);
app.use(rateLimiter);
app.use(wishlistsRoutes.routes());
app.use(wishlistsRoutes.allowedMethods());

app.use(usersRoute.routes());
app.use(usersRoute.allowedMethods());

app.use(emailsRoute.routes());
app.use(emailsRoute.allowedMethods());

console.log(`Server is running on port ${PORT} 🔥`);
app.listen({ port: PORT });

export default app;
