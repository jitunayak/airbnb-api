const express = require('express');
export const emailsRoute = express.Router();

const { createHttpError } = require('http-errors');
const { sendBookingConfirmationEmail } = require('../email/bookingConfirmation');
const { env } = require('../utils/config');

emailsRoute.post('/', async (req, res, next) => {
	const action = req.query.action;

	if (!action) {
		return next(createHttpError(400, 'Missing action'));
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

	return next(createHttpError(400, 'Invalid action'));
});
