import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import { emailsRoute, roomsRoute, usersRoute, wishlistsRoute } from './routes/index';
import { verifyToken } from './utils/authUtils';
import { handlerError } from './utils/util';

config();
const app = express();
app.use((req, res, next) => {
	try {
		next();
	} catch (error) {
		handlerError(req, res, error as Error);
	}
});

app.use(cors({ origin: '*', allowedHeaders: ['Content-Type', 'Authorization'] }));

app.get('/', (req, res) => res.send('Airbnb API is running 🔥'));
app.use(verifyToken);
// app.use(rateLimiter);
app.use('/api/v1/wishlists', wishlistsRoute);
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/emails', emailsRoute);
app.use('/api/v1/rooms', roomsRoute);

const port = process.env.PORT || 3000;
console.log(`Server is running on port ${port} 🔥`);
app.listen(port);

export default app;
