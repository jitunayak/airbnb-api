import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import express from 'express';
import { InternalServerError, TooManyRequests } from 'http-errors';
import { env } from '../utils/config';

let ratelimit: Ratelimit | null = null;

// Create a new ratelimiter, that allows 10 requests per 10 seconds
if (!ratelimit) {
	ratelimit = new Ratelimit({
		redis: new Redis({
			url: env.UPSTASH_URL,
			token: env.UPSTASH_TOKEN,
			enableTelemetry: true,
		}),
		ephemeralCache: new Map(),
		limiter: Ratelimit.slidingWindow(1, '10 s'),
	});
}

export const rateLimiter = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const identifier = 'api';
	if (!ratelimit) throw InternalServerError('Rate limit not initialized');
	const result = await ratelimit.limit(identifier);

	console.log({ result });
	if (!result.success) {
		throw TooManyRequests('Too Many Requests');
	}
	await next();
};
