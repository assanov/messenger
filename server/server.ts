import fastify from 'fastify';
import { config } from 'dotenv';
import cors from '@fastify/cors';
import { userRoutes } from './routes/users';
config();

const app = fastify();

app.register(cors, { origin: process.env.CLIENT_URL });
app.register(userRoutes);

app.listen({ port: parseInt(process.env.PORT!) });
