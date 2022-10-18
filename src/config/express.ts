import express from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import http from 'http';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(helmet());
app.use(
	cors({
		origin: '*',
		allowedHeaders: ['Content-Type', 'X-Authorization'],
		methods: ['GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD'],
	})
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.status(200).json({ message: 'Health check OK' });
});

export const httpServer = http.createServer(app);
