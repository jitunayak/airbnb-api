// import { Ratelimit } from ' @upstash/ratelimit';
// import { Redis } from ' @upstash/redis';
// import { createHttpError } from 'https://deno.land/std@0.188.0/http/http_errors.ts';
// import { Middleware } from 'https://deno.land/x/oak@v12.5.0/middleware.ts';
// import { env } from '../utils/config.ts';

// // Create a new ratelimiter, that allows 10 requests per 10 seconds
// let ratelimit: Ratelimit | null = null;

// if (!ratelimit) {
// 	ratelimit = new Ratelimit({
// 		redis: new Redis({
// 			url: env.UPSTASH_URL,
// 			token: env.UPSTASH_TOKEN,
// 			enableTelemetry: true,
// 		}),
// 		ephemeralCache: new Map(),
// 		limiter: Ratelimit.slidingWindow(5, '10 s'),
// 	});
// }

// export const rateLimiter: Middleware = async (_, next) => {
// 	const identifier = 'api';
// 	if (!ratelimit) throw createHttpError(500, 'Rate limit not initialized');
// 	const result = await ratelimit.limit(identifier);

// 	console.log({ result });
// 	if (!result.success) {
// 		throw createHttpError(429, 'Too Many Requests');
// 	}
// 	await next();
// };
