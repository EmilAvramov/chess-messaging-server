import express from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import http from 'http';
import cors from 'cors';
import { Server, Socket } from 'socket.io';

import {
	connect,
	connect_error,
	disconnect,
	getMessages,
	handleMessage,
} from '../services/socket.service';

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

const io = new Server(httpServer, {
	cors: {
		origin: '*',
		methods: ['GET, POST'],
	},
});

io.on('connection', (socket: Socket) => connect(socket));

io.on('getMessages', () => getMessages());

io.on('message', (socket, value: string) => handleMessage(socket, value));

io.on('disconnect', (socket: Socket) => disconnect(socket));

io.on('connect_error', (err: string) => connect_error(err));

export { httpServer, io };
