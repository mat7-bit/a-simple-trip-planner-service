import { SWAGGER_TAGS } from '@models/swagger';
import {
  ERROR_400_SCHEMA,
  ERROR_500_SCHEMA,
  TRIP_RECORD_SCHEMA,
} from './common';

export const MANAGER_LIST_TRIP_RECORDS = {
  tags: [SWAGGER_TAGS.MANAGER],
  description: 'List trip records',
  summary: 'listTripRecords',
  querystring: {
    type: 'object',
    required: ['createdBy'],
    properties: {
      createdBy: {
        type: 'string',
      },
      page: {
        type: 'number',
      },
      limit: {
        type: 'number',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        trips: {
          type: 'array',
          items: TRIP_RECORD_SCHEMA,
        },
        page: {
          type: 'number',
        },
        limit: {
          type: 'number',
        },
        total: {
          type: 'number',
        },
      },
    },
    400: ERROR_400_SCHEMA,
    500: ERROR_500_SCHEMA,
  },
};
