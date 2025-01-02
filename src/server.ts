import fastify from 'fastify';
import app, { options } from './app';

// production server
const start = async () => {
  const server = fastify(options);

  try {
    await server.register(app);
    await server.listen({
      port: parseInt(process.env.PORT || '') || 3000,
      host: '0.0.0.0',
    });
    await server.ready();
    console.log('Server is running:', server.addresses());
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();
