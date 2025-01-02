import { FastifyBaseLogger } from 'fastify';
import { Options, Sequelize } from 'sequelize';

export type Envs = {
  LOG_LEVEL: string;
  TRIP_API_URL: string;
  TRIP_API_KEY: string;
  DB_HOST: string;
  DB_NAME: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_PORT: string;
};

export class ApiError extends Error {
  constructor(public body: { code: number; message: string }) {
    super(body.message);
    this.name = 'ApiError';
  }
}

export type SequelizeRegisterFunction = (sequelize: Sequelize) => void;

export interface SequelizeConfig {
  options: Options;
  registerFns?: SequelizeRegisterFunction[];
  logger: FastifyBaseLogger;
}

export const PAGINATION_DEFAULT_PARAMS = {
  PAGE: 1,
  LIMIT: 10,
};
