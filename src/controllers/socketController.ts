import { IMessage } from '@socket-types';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

const users = new Map();

const defaultUser = {
	id: 1,
	name: 'Anonymous',
};

class Connection {
	public socket: Socket;
	public messages: Set<IMessage>;
	public expirationTimeMS: number;

	constructor(socket: Socket) {
		this.socket = socket;
		this.messages = new Set();
		this.expirationTimeMS = 5 * 60 * 1000;

		socket.on('connection', () => this.connection());
		socket.on('getMessages', () => this.getMessages());
		socket.on('message', (value: string) => this.handleMessage(value));
		socket.on('disconnect', () => this.socket.disconnect());
		socket.on('connect_error', (err: string) =>
			console.log(`connection error due to ${err}`)
		);
	}

	connection() {
		console.log('socket connected and waiting...');
	}

	sendMessage(message: IMessage) {
		this.socket.emit('message', message);
	}

	getMessages() {
		this.messages.forEach((message: IMessage) => this.sendMessage(message));
	}

	handleMessage(value: string) {
		const message = {
			id: uuidv4(),
			user: (users.get(this.socket) || defaultUser) as string,
			message: value,
			time: Date.now(),
		};

		this.messages.add(message);
		this.sendMessage(message);

		setTimeout(() => {
			this.messages.delete(message);
			this.socket.emit('deleteMessage', message.id);
		}, this.expirationTimeMS);
	}

	disconnect() {
		users.delete(this.socket);
	}
}

export const chat = (socket: Socket) => {
	socket.on('connection', () => {
		new Connection(socket);
	});
};