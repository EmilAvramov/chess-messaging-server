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

export const sendMessage = (message: IMessage) => io.emit('message', message);

export const getMessages = () =>
	messages.forEach((message: IMessage) => sendMessage(message));

export const handleMessage = (value: string, socket: Socket) => {
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

export const disconnect = (socket: Socket) => {
	users.delete(socket);
};
