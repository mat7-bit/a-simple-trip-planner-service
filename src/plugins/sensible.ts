import fp from 'fastify-plugin';
import sensible from '@fastify/sensible';

/**
 * this plugins adds some utilities to handle http errors
 */
export default fp(async fastify => {
  await fastify.register(sensible);
});
