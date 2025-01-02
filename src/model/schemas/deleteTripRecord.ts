import { SWAGGER_TAGS } from '@models/swagger';
import { ERROR_400_SCHEMA, ERROR_500_SCHEMA } from './common';

export const MANAGER_DELETE_TRIP_RECORD = {
  tags: [SWAGGER_TAGS.MANAGER],
  description: 'Delete trip record by id',
  summary: 'deleteTripRecord',
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        deleted: {
          type: 'boolean',
        },
      },
    },
    400: ERROR_400_SCHEMA,
    500: ERROR_500_SCHEMA,
  },
};
