declare module '@socket-types' {
	export interface IMessage {
		id: string;
		user: string;
		message: string;
		time: number;
	}
}
