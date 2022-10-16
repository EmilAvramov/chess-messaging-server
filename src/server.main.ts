import app from './config/express';
import { port } from './config/settings';

try {
	app.listen(port, () => console.log(`Server listening on port ${port}...`));
} catch (err: any) {
	console.log(err);
}
