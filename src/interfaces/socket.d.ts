export interface IMessage {
	id: string;
	user: string;
	name: string;
	message: string;
	time: number;
}

export interface ServerToClientEvents {
	broadcast: () => void;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
	socket_id: (id: string) => void;
	message: (msg: IMessage) => void;
	getMessages: () => void;
	join: (status: string) => void;
}

export interface ClientToServerEvents {
	message: (msg: string, user: string, name: string) => void;
	getMessages: () => void;
	join: (room: string) => void;
	connect_error: (err: string) => void;
}

export interface InterServerEvents {
	ping: () => void;
}

export interface SocketData {
	name: string;
	age: number;
}
