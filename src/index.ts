import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';
import { bookingsRoute } from './routes/bookings';
import { emailsRoute, roomsRoute, usersRoute, wishlistsRoute } from './routes/index';
import { handlerError } from './utils/util';

config();
const app = express();

import http from 'http';
const server = http.createServer(app);

app.use((req, res, next) => {
	try {
		next();
	} catch (error) {
		handlerError(req, res, error as Error);
	}
});

app.use(express.json());
app.use(cors({ origin: ['https://aircnc-jitunayak.vercel.app', 'http://localhost:3000'] }));

app.get('/', (req, res) => res.send('Airbnb API is running 🔥'));
// app.use(verifyToken);
// app.use(rateLimiter);
app.use('/api/v1/wishlists', wishlistsRoute);
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/emails', emailsRoute);
app.use('/api/v1/rooms', roomsRoute);
app.use('/api/v1/bookings', bookingsRoute);

const io = new Server(server, {
	cors: {
		origin: ['http://localhost:3000', 'https://aircnc-jitunayak.vercel.app'],
		methods: ['GET', 'POST'],
	},
});
io.on('connection', (socket) => {
	socket.on('message', (message) => {
		socket.broadcast.emit('message', message);
	});
});
app.use('*', (req, res) => res.status(404).send('Route not found'));

const port = process.env.PORT || 3000;
console.log(`Server is running on port http://localhost:${port} 🔥`);
server.listen(port);

export default app;
