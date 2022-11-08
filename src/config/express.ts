import express from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

import {
	connect,
	connect_error,
	disconnect,
	getMessages,
	handleMessage,
} from '../services/socket.service';
import {
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData,
} from '../interfaces/socket';

dotenv.config();

const app = express();

app.use(helmet());
app.use(
	cors({
		origin: '*',
		allowedHeaders: ['Content-Type', 'X-Authorization'],
		methods: ['GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD'],
		credentials: true,
	})
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.status(200).json({ message: 'Health check OK' });
});

const httpServer = http.createServer(app);

const io = new Server<
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData
>(httpServer, {
	cors: {
		origin: '*',
		methods: ['GET, POST'],
	},
});

io.on('connection', (socket) => {
	connect(socket);

	socket.on('message', (msg: string) => handleMessage(socket, msg));
	socket.on('getMessages', () => getMessages());
	socket.on('disconnect', () => disconnect(socket));
	socket.on('connect_error', (err: string) => connect_error(err));
});

export { httpServer, io };
