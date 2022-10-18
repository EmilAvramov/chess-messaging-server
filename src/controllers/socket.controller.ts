import { Socket } from 'socket.io';
import { io } from '../config/socket';
import {
	connect,
	connect_error,
	disconnect,
	getMessages,
	handleMessage,
} from '../services/socket.service';

io.on('connection', (socket: Socket) => connect(socket));

io.on('getMessages', () => getMessages());

io.on('message', (socket: Socket, value: string) =>
	handleMessage(socket, value)
);

io.on('disconnect', (socket: Socket) => disconnect(socket));

io.on('connect_error', (err: string) => connect_error(err));
