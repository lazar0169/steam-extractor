import f from 'fastify';
import multipart from 'fastify-multipart';
import cors from 'fastify-cors';
import helmet from 'fastify-helmet';
import rateLimit from 'fastify-rate-limit';
import routes from './routes/index.js';
import rateLimitOptions from './config/rateLimit.json';
import corsOptions from './config/cors.js';

const fastify = f({ logger: true });
fastify.register(helmet);
fastify.register(multipart);
fastify.register(rateLimit, rateLimitOptions);
fastify.register(cors, corsOptions);

routes.forEach((route) => {
    fastify.route(route);
});

const start = async () => {
    try {
        await fastify.listen(3000);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
