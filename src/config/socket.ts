import { Socket } from 'socket.io';
import { v5 as uuidv5 } from 'uuid'

const messages = new Set();
const users = new Map();

const defaultUser = {
	id: 1,
	name: 'Anonymous',
};

const messageExpirationTimeMS = 5 * 60 * 1000;

class Connection {
	public socket: Socket;

	constructor(socket: Socket) {
		this.socket = socket;

		socket.on('getMessages', () => this.getMessages());
		socket.on('message', (value: string) => this.handleMessage(value));
		socket.on('disconnect', () => this.socket.disconnect());
		socket.on('connect_error', (err: string) =>
			console.log(`connection error due to ${err}`)
		);
	}

    sendMessage(message: string) {
        this.socket.emit('message', message)
    }

    getMessages():void {
        messages.forEach((message:string) => this.sendMessage(message))
    }

    handleMessage(value:string) {
        const message = {
            id: uuidv5
        }
    }

}
