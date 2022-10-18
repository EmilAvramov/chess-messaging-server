import { httpServer } from './config/express';
import { port } from './config/settings';
import { io } from './config/socket';

try {
	io.listen(5057);
	httpServer.listen(port as number, () =>
		console.log(`Server listening to port ${port}...`)
	);
} catch (err: any) {
	console.log(err);
}
