import { io } from '../config/express';
import { v4 as uuidv4 } from 'uuid';
import { Socket } from 'socket.io';
import { expirationTimeMS } from '../config/settings';
import { IMessage } from '@types-socket';

const messages: Set<IMessage> = new Set();
const users = new Map();

const defaultUser = {
	id: 1,
	name: 'Anonymous',
};

const sendMessage = (message: IMessage) => io.emit('message', message);

export const getMessages = () =>
	messages.forEach((message: IMessage) => sendMessage(message));

export const handleMessage = (socket: Socket, value: string) => {
	const message = {
		id: uuidv4(),
		user: (users.get(socket) || defaultUser) as string,
		message: value,
		time: Date.now(),
	};

	console.log(message)

	messages.add(message);
	sendMessage(message);

	setTimeout(() => {
		messages.delete(message);
		socket.emit('deleteMessage', message.id);
	}, expirationTimeMS);
};

export const connect = (socket: Socket) => {
	console.log(`User ${socket.id} connected on ${new Date()}`);
	io.to(socket.id).emit('socket_id', socket.id);
};

export const disconnect = (socket: Socket) => {
	console.log(`User ${socket.id} disconnected.`)
	users.delete(socket);
};

export const connect_error = (err: string) => console.log(err);
