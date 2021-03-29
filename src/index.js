import extract from './extraction.js';
import f from 'fastify';
import routes from './routes/index.js'

const fastify = f({ logger: true });

routes.forEach((route) => {
  fastify.route(route);
})
  
// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
start()
// extract();