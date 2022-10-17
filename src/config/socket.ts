import { Server } from 'socket.io';
import { httpServer } from './express';

export const io = new Server(httpServer, {
	cors: {
		origin: '*',
		methods: ['GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD'],
		allowedHeaders: ['Content-Type', 'X-Authorization'],
		credentials: false,
	},
});
