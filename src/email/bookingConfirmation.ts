import React from 'react';
import { Resend } from 'resend';
import { BookingConfirmed } from './templates/BookingConfirmed';

export const sendBookingConfirmationEmail = ({
	to,
	name,
	apiKey,
	bookingId,
	checkInDate,
	checkOutDate,
}: {
	to: string;
	name: string;
	apiKey: string;
	bookingId: string;
	checkInDate: string;
	checkOutDate: string;
}) => {
	const resend = new Resend(apiKey);

	return resend.emails.send({
		from: 'onboarding@resend.dev',
		to: to,
		subject: 'Airbnb booking confirmation',
		// html: `Your booking has been confirmed with aircnc. We wait to onboard you soon!`,
		react: React.createElement(BookingConfirmed, {
			name: name,
			url: 'https://aircnc-jitunayak.vercel.app',
			bookingId: bookingId,
			checkInDate: checkInDate,
			checkOutDate: checkOutDate,
		}),
	});
};
