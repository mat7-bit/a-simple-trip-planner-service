import { ENV_ITEMS } from "../constants";

export const ENVIRONMENT_SCHEMA = {
  type: 'object',
  required: [
    'LOG_LEVEL',
  ],
  properties: {
    [ENV_ITEMS.LOG_LEVEL]: {
      type: 'string',
      default: 'WARN',
    },
  },
};
