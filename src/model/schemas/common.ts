export const ERROR_SCHEMA = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      description: 'Error message',
    },
  },
};

export const ERROR_400_SCHEMA = {
  ...ERROR_SCHEMA,
  description: 'Invalid request',
};

export const ERROR_404_SCHEMA = {
  ...ERROR_SCHEMA,
  description: 'Not found',
};

export const ERROR_500_SCHEMA = {
  ...ERROR_SCHEMA,
  description: 'Server error',
};
