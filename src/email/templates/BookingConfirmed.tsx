import { Button } from '@react-email/button';
import { Body, Container, Heading, Hr, Section, Tailwind, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';
import { AirBnbIcon } from './AirBnbIcon';

interface IProps {
	name: string;
	url: string;
	bookingId: string;
}

export default function BookingConfirmed(props: IProps) {
	const { url, name, bookingId } = props;

	return (
		<Html lang="en">
			<Tailwind>
				<Body className="bg-white my-auto mx-auto font-sans">
					<Container className="shadow-lg border border-solid border-neutral-200 rounded my-[40px] mx-auto p-[20px] w-[465px]">
						<AirBnbIcon />
						<Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
							Hi <strong>{name}</strong>
						</Heading>
						<Text>Your booking has been confirmed with aircnc. We wait to onboard you soon! </Text>
						<strong>Booking Id: {bookingId}</strong>
						<Text>Thank you</Text>
						<Hr />
						<Section>
							<Button className="bg-[#ff002f] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3" href={url}>
								See Bookings
							</Button>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
