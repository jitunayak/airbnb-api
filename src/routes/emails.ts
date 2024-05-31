import { NextFunction, Request, Response, Router } from 'express';
import { BadRequest } from 'http-errors';
import { sendBookingConfirmationEmail } from '../email/bookingConfirmation';
import { verifyToken } from '../utils/authUtils';
import { env } from '../utils/config';
import { rateLimiter } from '../utils/rateLimiter';

export const emailsRoute = Router();

emailsRoute.post('/', verifyToken, rateLimiter, async (req: Request, res: Response, next: NextFunction) => {
	const action = req.query.action;
	if (!action) {
		return next(BadRequest('Missing action'));
	}
	if (action === 'bookingConfirmation') {
		console.log(req.body);
		const { name, email, checkInDate, checkOutDate } = req.body;

		if (!name || !email || !checkInDate || !checkOutDate) {
			return next(BadRequest('Missing fields'));
		}
		const result = await sendBookingConfirmationEmail({
			to: email,
			name,
			apiKey: env.EMAIL_API_KEY,
			bookingId: '000023',
			checkInDate,
			checkOutDate,
		});

		res.json({
			message: 'Email sent successfully',
			data: result,
		});
		return;
	}

	return next(BadRequest('Invalid action'));
});
