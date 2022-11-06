declare module '@types-socket' {
	interface IMessage {
		id: string;
		user: string;
		message: string;
		time: number;
	}

	interface ServerToClientEvents {
		broadcast: () => void;
		basicEmit: (a: number, b: string, c: Buffer) => void;
		withAck: (d: string, callback: (e: number) => void) => void;
		socket_id: (id: string) => void;
		message: (msg: IMessage) => void;
		getMessages: () => void;
	}

	interface ClientToServerEvents {
		message: (msg: string) => void;
		getMessages: () => void;
		connect_error: (err: string) => void;
	}

	interface InterServerEvents {
		ping: () => void;
	}

	interface SocketData {
		name: string;
		age: number;
	}
}
