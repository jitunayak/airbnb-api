import { Router } from 'https://deno.land/x/oak@v12.5.0/router.ts';
import { HTTPException } from 'npm:hono/http-exception';
import { sendBookingConfirmationEmail } from '../email/bookingConfirmation.ts';
import { Env } from '../index.ts';
import { config } from '../utils/config.ts';

export const emailsRoute = new Router<{ Bindings: Env }>({ prefix: '/api/v1/emails' });

emailsRoute.post('/', async (c) => {
	const action = c.request.url.searchParams.get('action');

	if (!action) {
		throw new HTTPException(400, { message: 'Missing action' });
	}
	if (action === 'bookingConfirmation') {
		const body = await c.request.body().value;
		const { name, email, bookingId } = body;
		const result = await sendBookingConfirmationEmail({
			to: email,
			name: name,
			apiKey: config.EMAIL_API_KEY,
			bookingId: '33423111',
		});
		c.response.body = {
			message: 'Email sent successfully',
			data: result,
		};
		return;
	} else {
		throw new HTTPException(400, { message: 'Invalid action' });
	}
});
