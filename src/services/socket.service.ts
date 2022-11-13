import { io } from '../config/express';
import { v4 as uuidv4 } from 'uuid';
import { Socket } from 'socket.io';
import { expirationTimeMS } from '../config/settings';
import { IMessage } from '../interfaces/socket';

const messages: Set<IMessage> = new Set();
const users = new Map();

const sendMessage = (message: IMessage) => io.emit('message', message);

export const getMessages = () => {
	messages.forEach((message: IMessage) => sendMessage(message));
};

export const handleMessage = (
	socket: Socket,
	value: string,
	user: string,
	name: string
) => {
	const message = {
		id: uuidv4(),
		user,
		name,
		message: value,
		time: Date.now(),
	};

	messages.add(message);
	sendMessage(message);

	setTimeout(() => {
		messages.delete(message);
		socket.emit('deleteMessage', message.id);
	}, expirationTimeMS);
};

export const connect = (socket: Socket) => {
	console.log(`User ${socket.id} connected on ${new Date()}`);
	socket.join('lobby');
	io.to(socket.id).emit('socket_id', socket.id);
	io.to(socket.id).emit('join', 'Lobby');
};

export const disconnect = (socket: Socket) => {
	console.log(`User ${socket.id} disconnected.`);
	users.delete(socket);
};

export const connect_error = (err: string) => console.log(err);

export const join_server = (socket: Socket, game: string) => {
	socket.join(game);
	io.to(socket.id).emit('join', 'Success');
};
