import { Envs, SequelizeConfig } from '@models/common';
import { FastifyBaseLogger } from 'fastify';
import { Sequelize } from 'sequelize';
import { registerTripModels } from './trip-repository';

export const buildDbConfig = ({
  env,
  logger,
}: {
  env: Envs;
  logger: FastifyBaseLogger;
}): SequelizeConfig => ({
  options: {
    database: env.DB_NAME,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    port: parseInt(env.DB_PORT, 10),
    host: env.DB_HOST,
    dialect: 'postgres',
    pool: {
      max: 1,
      min: 0,
      idle: 0,
      acquire: 15000,
      evict: 5000,
    },
    logging: logger.debug.bind(logger),
  },
  logger,
  registerFns: [registerTripModels],
});

let dbInstance: Sequelize;

const init = (config: SequelizeConfig) => {
  if (!dbInstance) {
    dbInstance = new Sequelize(config.options);
    if (config.registerFns) {
      for (const registerFn of config.registerFns) {
        registerFn(dbInstance);
      }
    }
    process.on('SIGTERM', async () => {
      config.logger.info('Shutdown signal received.');

      if (dbInstance) {
        config.logger.info('Db connection found. Closing it.');
        await dbInstance.close();
        dbInstance = null;
        config.logger.info('Connection closed.');
      }

      config.logger.info('Cleanup finished. Exiting.');
      process.exit(0);
    });
  }
};

export const connect = async (config: SequelizeConfig) => {
  if (!config?.options || !config.logger) {
    throw new Error('Invalid db connection config');
  }
  if (!dbInstance) {
    init(config);
    await dbInstance.authenticate();
    await dbInstance.sync();
  } else {
    await dbInstance.authenticate();
  }
  config.logger.debug('Db connection has been established successfully.');
};
