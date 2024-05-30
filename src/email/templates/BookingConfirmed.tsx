import { Body, Button, Container, Heading, Hr, Html, Img, Preview, Section, Tailwind, Text } from '@react-email/components';
import React from 'react';

interface IProps {
	name: string;
	url: string;
	bookingId: string;
	checkInDate: string;
	checkOutDate: string;
}
const logoUrl = 'https://i.pinimg.com/originals/3c/bf/be/3cbfbe148597341fa56f2f87ade90956.png';

export const BookingConfirmed: React.FC<IProps> = (props: IProps) => {
	const { url, name, bookingId, checkInDate, checkOutDate } = props;

	return (
		<Html lang="en">
			<Preview>Your booking has been confirmed</Preview>
			<Tailwind>
				<Body className="bg-white my-auto mx-auto font-sans">
					<Container className="shadow-lg border border-solid border-neutral-200 rounded my-[40px] mx-auto p-[20px] w-[465px]">
						<Section>
							<Img src={logoUrl} width="160" alt="Vercel" className="my-0 mx-auto" />
						</Section>
						<Heading className="text-black text-[24px] font-normal text-center p-0 mb-[30px] mt-[15px] mx-0">
							Hi <strong>{name}</strong>
						</Heading>
						<Text>Your booking has been confirmed with aircnc. We wait to onboard you soon! </Text>
						<Heading as="h3">
							Booking Id: <b>{bookingId}</b>
						</Heading>

						<Text>
							Check in: <b>{checkInDate}</b>
						</Text>
						<Text>
							Check out: <b>{checkOutDate}</b>
						</Text>

						<Text>Thank you</Text>
						<Hr />
						<Section className="text-center mt-[32px] mb-[32px]">
							<Button className="bg-[#ff002f] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3" href={url}>
								See Bookings
							</Button>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};
