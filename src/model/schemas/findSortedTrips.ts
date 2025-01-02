import { SWAGGER_TAGS } from '@models/swagger';
import { ERROR_400_SCHEMA, ERROR_500_SCHEMA } from './common';
import {
  FIND_SORTED_TRIPS_SORT_BY_VALUES,
  SUPPORTED_TRIP_POINTS_LIST,
} from '@models/trip';

export const TRIPS_FIND_TRIPS_SORTED_BY_PARAM = {
  tags: [SWAGGER_TAGS.TRIPS],
  description: 'Find trips sorted by a parameter',
  summary: 'findSortedTrips',
  querystring: {
    type: 'object',
    required: ['origin', 'destination', 'sort_by'],
    properties: {
      origin: {
        type: 'string',
        enum: SUPPORTED_TRIP_POINTS_LIST,
      },
      destination: {
        type: 'string',
        enum: SUPPORTED_TRIP_POINTS_LIST,
      },
      sort_by: {
        type: 'string',
        enum: [
          FIND_SORTED_TRIPS_SORT_BY_VALUES.CHEAPEST,
          FIND_SORTED_TRIPS_SORT_BY_VALUES.FASTEST,
        ],
      },
    },
  },
  response: {
    200: {
      type: 'array',
      description: 'Trips found',
      items: {
        type: 'object',
        properties: {
          origin: {
            type: 'string',
          },
          destination: {
            type: 'string',
          },
          cost: {
            type: 'number',
          },
          duration: {
            type: 'number',
          },
          type: {
            type: 'string',
          },
          id: {
            type: 'string',
          },
          display_name: {
            type: 'string',
          },
        },
      },
    },
    400: ERROR_400_SCHEMA,
    500: ERROR_500_SCHEMA,
  },
};
