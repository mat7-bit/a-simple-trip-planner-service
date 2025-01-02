export const ENVIRONMENT_SCHEMA = {
  type: 'object',
  required: ['TRIP_API_URL', 'TRIP_API_KEY'],
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
  },
};
