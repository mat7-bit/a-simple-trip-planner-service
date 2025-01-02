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

export const TRIP_RECORD_SCHEMA = {
  type: 'object',
  required: [
    'id',
    'origin',
    'destination',
    'startDate',
    'createdBy',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ],
  properties: {
    id: {
      type: 'string',
    },
    origin: {
      type: 'string',
    },
    destination: {
      type: 'string',
    },
    description: {
      type: 'string',
      nullable: true,
    },
    startDate: {
      type: 'string',
      format: 'date-time',
    },
    createdBy: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
    },
    deletedAt: {
      type: 'string',
      format: 'date-time',
      nullable: true,
    },
  },
};
