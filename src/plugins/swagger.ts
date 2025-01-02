import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { SWAGGER_DEFINITION } from '@models/swagger';
import fp from 'fastify-plugin';

/**
 * this plugins generates the swagger documentation and the swagger ui
 */
export default fp(async fastify => {
  await fastify.register(fastifySwagger, {
    swagger: SWAGGER_DEFINITION,
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/swagger',
  });
});
