import { buildDbConfig, connect } from '@data/db';
import { Envs } from '@models/common';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

export type DbConnectPluginOpts = object;

async function dbConnectPlugin(fastify: FastifyInstance) {
  fastify.addHook('preHandler', async () => {
    fastify.log.debug('Setting up db connection');
    const dbConfig = buildDbConfig({
      env: fastify.getEnvs<Envs>(),
      logger: fastify.log,
    });
    await connect(dbConfig);
  });
}

export default fp<DbConnectPluginOpts>(dbConnectPlugin);
