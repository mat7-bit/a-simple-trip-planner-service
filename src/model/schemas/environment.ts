export const ENVIRONMENT_SCHEMA = {
  type: 'object',
  required: [
    'TRIP_API_URL',
    'TRIP_API_KEY',
    'DB_HOST',
    'DB_NAME',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_PORT',
  ],
  properties: {
    LOG_LEVEL: {
      type: 'string',
      default: 'WARN',
    },
    TRIP_API_URL: {
      type: 'string',
    },
    TRIP_API_KEY: {
      type: 'string',
    },
    DB_HOST: {
      type: 'string',
    },
    DB_NAME: {
      type: 'string',
    },
    DB_USERNAME: {
      type: 'string',
    },
    DB_PASSWORD: {
      type: 'string',
    },
    DB_PORT: {
      type: 'string',
    },
  },
};
