import fastifyEnv from '@fastify/env';
import fp from 'fastify-plugin'
import { ENVIRONMENT_SCHEMA } from '@models/schemas';

/**
 * this plugins adds support to dotenv files and validation for environment variables
 */
export default fp(async (fastify) => {
  await fastify.register(fastifyEnv, {
    dotenv: true,
    schema: ENVIRONMENT_SCHEMA,
  });
})
