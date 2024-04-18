import { createHttpError } from 'https://deno.land/std@0.188.0/http/http_errors.ts';
import { Router } from 'https://deno.land/x/oak@v12.5.0/router.ts';
import { sendBookingConfirmationEmail } from '../email/bookingConfirmation.ts';
import { env } from '../utils/config.ts';

export const emailsRoute = new Router({ prefix: '/api/v1/emails' });

emailsRoute.post('/', async (c) => {
	const action = c.request.url.searchParams.get('action');

	if (!action) {
		throw createHttpError(400, 'Missing action');
	}
	if (action === 'bookingConfirmation') {
		const body = await c.request.body().value;
		const { name, email, bookingId } = body;
		const result = await sendBookingConfirmationEmail({
			to: email,
			name: name,
			apiKey: env.EMAIL_API_KEY,
			bookingId: bookingId,
		});
		c.response.body = {
			message: 'Email sent successfully',
			data: result,
		};
		return;
	} else {
		throw createHttpError(400, 'Invalid action');
	}
});
