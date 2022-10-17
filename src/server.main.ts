import { httpServer } from './config/express';
import { port } from './config/settings';

try {
	httpServer.listen(port as number, () =>
		console.log(`Server running on port ${port}...`)
	);
} catch (err: any) {
	console.log(err);
}
