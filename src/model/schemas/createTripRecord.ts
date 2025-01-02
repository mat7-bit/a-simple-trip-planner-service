import { SWAGGER_TAGS } from '@models/swagger';
import {
  ERROR_400_SCHEMA,
  ERROR_500_SCHEMA,
  TRIP_RECORD_SCHEMA,
} from './common';
import { SUPPORTED_TRIP_POINTS_LIST } from '@models/trip';

export const MANAGER_CREATE_TRIP_RECORD = {
  tags: [SWAGGER_TAGS.MANAGER],
  description: 'Create a trip record',
  summary: 'createTripRecord',
  body: {
    type: 'object',
    required: ['origin', 'destination', 'startDate', 'createdBy'],
    properties: {
      origin: {
        type: 'string',
        enum: SUPPORTED_TRIP_POINTS_LIST,
      },
      destination: {
        type: 'string',
        enum: SUPPORTED_TRIP_POINTS_LIST,
      },
      description: {
        type: 'string',
      },
      startDate: {
        type: 'string',
        format: 'date-time',
      },
      createdBy: {
        type: 'string',
      },
    },
  },
  response: {
    200: TRIP_RECORD_SCHEMA,
    400: ERROR_400_SCHEMA,
    500: ERROR_500_SCHEMA,
  },
};
