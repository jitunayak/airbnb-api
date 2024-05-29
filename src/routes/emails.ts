import { NextFunction, Request, Response, Router } from 'express';
import { BadRequest } from 'http-errors';
import { sendBookingConfirmationEmail } from '../email/bookingConfirmation';
import { env } from '../utils/config';

export const emailsRoute = Router();

emailsRoute.post('/', async (req: Request, res: Response, next: NextFunction) => {
	const action = req.query.action;
	if (!action) {
		return next(BadRequest('Missing action'));
	}
	if (action === 'bookingConfirmation') {
		const { name, email, bookingId } = req.body;
		const result = await sendBookingConfirmationEmail({
			to: email,
			name,
			apiKey: env.EMAIL_API_KEY,
			bookingId,
		});

		res.json({
			message: 'Email sent successfully',
			data: result,
		});
		return;
	}

	return next(BadRequest('Invalid action'));
});
