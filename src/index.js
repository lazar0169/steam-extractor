import f from 'fastify';
import multipart from 'fastify-multipart';
import cors from 'fastify-cors';
import helmet from 'fastify-helmet';
import rateLimit from 'fastify-rate-limit';
import session from 'fastify-cookie';
import routes from './routes/index.js';
import appOptions from './config/app.json';
import rateLimitOptions from './config/rateLimit.json';
import corsOptions from './config/cors.js';
import cookieOptions from './config/cookie.js';

const fastify = f(appOptions);
fastify.register(helmet);
fastify.register(multipart);
fastify.register(rateLimit, rateLimitOptions);
fastify.register(cors, corsOptions);
fastify.register(session, cookieOptions);

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

fastify.addHook('preValidation', (req, _reply, done) => {
    req.log.info({ params: req.params, body: req.body, query: req.query, id: req.id }, 'received data');
    done();
});

start();
