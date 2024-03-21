import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { Env } from '..';
import { sendBookingConfirmationEmail } from '../email/bookingConfirmation';

export const emailsRoute = new Hono<{ Bindings: Env }>();

emailsRoute.post('/', async (c) => {
	const { action } = c.req.query();
	if (action === 'bookingConfirmation') {
		const body = await c.req.json();
		const { name, email, bookingId } = body;
		const result = await sendBookingConfirmationEmail({
			to: email,
			name: name,
			apiKey: c.env.EMAIL_API_KEY,
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
