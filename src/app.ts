import { join } from 'path';
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify';
import { Envs } from '@models/common';

export interface AppOptions
  extends FastifyServerOptions,
    Partial<AutoloadPluginOptions> {}

const options: AppOptions = {
  logger: true,
};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  // load all plugins defined in plugins folder
  await fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts,
    // ignore db-connect plugin since it'll be loaded for a limited set of routes
    ignorePattern: /(?:\.test\.js|db-connect\.js)$/,
  });

  // override log level using env
  const logLevel = fastify.getEnvs<Envs>().LOG_LEVEL;
  fastify.log.level = logLevel;

  // load all routes defined in routes folder
  await fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts,
  });
};

export default app;
export { app, options };
