import { ApiError } from '@models/common';
import { FastifyInstance, FastifyError } from 'fastify';
import fp from 'fastify-plugin';

export type ErrorHandlerOptions = object;

async function errorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler(async (error: FastifyError) => {
    if (error instanceof ApiError) {
      fastify.log.error(
        `Got API error - ${error.body.code} - ${error.body.message}`,
      );
      return fastify.httpErrors.createError(
        (error as ApiError).body.code,
        (error as ApiError).body.message,
      );
    }
    if (error.validation) {
      fastify.log.error(
        `Got validation error - ${error.statusCode} - ${error.cause} - ${error.message}`,
      );
      return fastify.httpErrors.badRequest(`Invalid request: ${error.message}`);
    }
    fastify.log.error(`Critical error: ${error.message} - ${error.stack}`);
    return fastify.httpErrors.createError(500, 'Critical error. Check logs.');
  });
}

export default fp<ErrorHandlerOptions>(errorHandler);
