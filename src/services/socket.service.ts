import { IMessage } from '@socket-types';
import { io } from '../config/socket';
import { v4 as uuidv4 } from 'uuid';
import { Socket } from 'socket.io';
import { expirationTimeMS } from '../config/settings';

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

	messages.add(message);
	sendMessage(message);

	setTimeout(() => {
		messages.delete(message);
		socket.emit('deleteMessage', message.id);
	}, expirationTimeMS);
};

export const connect = (socket: Socket) => {
	io.to(socket.id).emit('socket_id', socket.id);
};

export const disconnect = (socket: Socket) => {
	users.delete(socket);
};

export const connect_error = (err: string) => console.log(err)