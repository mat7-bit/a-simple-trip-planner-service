import fp from 'fastify-plugin'

/**
 * this plugins prints the registered routes for debug purposes
 */
export default fp(async (fastify) => {
  await fastify.register(import('fastify-print-routes'));
})
