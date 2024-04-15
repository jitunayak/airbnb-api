import { Hono } from 'npm:hono';
import { HTTPException } from 'npm:hono/http-exception';
import { sendBookingConfirmationEmail } from '../email/bookingConfirmation.ts';
import { Env } from '../index.ts';
import { config } from '../utils/config.ts';

export const emailsRoute = new Hono<{ Bindings: Env }>();

emailsRoute.post('/', async (c) => {
	const { action } = c.req.query();
	if (action === 'bookingConfirmation') {
		const body = await c.req.json();
		const { name, email, bookingId } = body;
		const result = await sendBookingConfirmationEmail({
			to: email,
			name: name,
			apiKey: config.EMAIL_API_KEY,
			bookingId: '33423111',
		});
		return c.json({
			message: 'Email sent successfully',
			data: result,
		});
	} else {
		throw new HTTPException(400, { message: 'Invalid action' });
	}
});
