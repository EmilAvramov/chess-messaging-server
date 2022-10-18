import { httpServer } from './config/express';
import { port } from './config/settings';

try {
	httpServer.listen(3001, () =>
		console.log(`Server listening to port ${port}`)
	);
} catch (err: any) {
	console.log(err);
}
