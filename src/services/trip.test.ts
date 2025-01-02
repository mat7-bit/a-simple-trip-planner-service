/* eslint-disable @typescript-eslint/no-explicit-any */
import { TripService } from './trip';
import axios from 'axios';
import {
  FIND_SORTED_TRIPS_SORT_BY_VALUES,
  FindSortedTripsRequest,
  SUPPORTED_TRIP_POINTS_LIST,
} from '@models/trip';
import { ApiError, Envs } from '@models/common';
import {
  TRIP_API_GET_TRIPS_PATH,
  TRIP_API_KEY_HEADER,
  TRIP_API_QUERY_PARAMS,
} from '@models/constants';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockEnvs: Envs = {
  TRIP_API_URL: 'https://mockapi.com',
  TRIP_API_KEY: 'mock-api-key',
  LOG_LEVEL: 'error',
};

const mockedLogger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
};

describe('TripService findSortedTrips method', () => {
  let tripService: TripService;

  beforeEach(() => {
    tripService = new TripService({
      env: mockEnvs,
      logger: mockedLogger as any,
    });
    jest.clearAllMocks();
  });

  it('should throw an error if required parameters are missing', async () => {
    const invalidRequests = [
      { origin: 'ABC', destination: 'ABC' },
      { origin: 'ABC', sort_by: 'CHEAPEST' },
      { destination: 'ABC', sort_by: 'CHEAPEST' },
      null,
      {},
    ];

    for (const invalidRequest of invalidRequests) {
      await expect(
        tripService.findSortedTrips(invalidRequest as any),
      ).rejects.toThrow(
        new ApiError({
          code: 400,
          message: 'Parameters origin, destination and sort_by are required',
        }),
      );
    }
  });

  it('should throw an error if sort_by method is unsupported', async () => {
    const invalidRequest = {
      origin: 'ABC',
      destination: 'ABC',
      sort_by: 'INVALID',
    };

    await expect(
      tripService.findSortedTrips(invalidRequest as any),
    ).rejects.toThrow(
      new ApiError({
        code: 400,
        message: 'Parameter sort_by must be either cheapest or fastest',
      }),
    );
  });

  it('should throw an error if origin or destination is unsupported', async () => {
    const invalidRequests = [
      {
        origin: 'ABC',
        destination: SUPPORTED_TRIP_POINTS_LIST[0],
        sort_by: FIND_SORTED_TRIPS_SORT_BY_VALUES.CHEAPEST,
      },
      {
        destination: 'ABC',
        origin: SUPPORTED_TRIP_POINTS_LIST[1],
        sort_by: FIND_SORTED_TRIPS_SORT_BY_VALUES.CHEAPEST,
      },
      {
        origin: 'ABC',
        destination: 'DEF',
        sort_by: FIND_SORTED_TRIPS_SORT_BY_VALUES.FASTEST,
      },
    ];

    for (const invalidRequest of invalidRequests) {
      await expect(
        tripService.findSortedTrips(invalidRequest as any),
      ).rejects.toThrow(
        new ApiError({
          code: 400,
          message:
            'Parameters origin and destination must be one of the supported points',
        }),
      );
    }
  });

  it('should fetch trips and return them sorted by cost', async () => {
    const targetOrigin = SUPPORTED_TRIP_POINTS_LIST[0];
    const targetDestination = SUPPORTED_TRIP_POINTS_LIST[1];
    const mockTrips = [
      {
        id: '1',
        origin: targetOrigin,
        destination: targetDestination,
        cost: 300,
        duration: 400,
      },
      {
        id: '2',
        origin: targetOrigin,
        destination: targetDestination,
        cost: 200,
        duration: 500,
      },
      {
        id: '3',
        origin: targetOrigin,
        destination: targetDestination,
        cost: 400,
        duration: 300,
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockTrips });

    const expectedResult = [mockTrips[1], mockTrips[0], mockTrips[2]];

    const request: FindSortedTripsRequest = {
      origin: targetOrigin,
      destination: targetDestination,
      sort_by: FIND_SORTED_TRIPS_SORT_BY_VALUES.CHEAPEST,
    };

    const result = await tripService.findSortedTrips(request);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${mockEnvs.TRIP_API_URL}${TRIP_API_GET_TRIPS_PATH}`,
      {
        params: {
          [TRIP_API_QUERY_PARAMS.ORIGIN]: targetOrigin,
          [TRIP_API_QUERY_PARAMS.DESTINATION]: targetDestination,
        },
        headers: {
          [TRIP_API_KEY_HEADER]: mockEnvs.TRIP_API_KEY,
        },
      },
    );

    expect(result).toEqual(expectedResult);
  });

  it('should fetch trips and return them sorted by duration', async () => {
    const targetOrigin = SUPPORTED_TRIP_POINTS_LIST[0];
    const targetDestination = SUPPORTED_TRIP_POINTS_LIST[1];
    const mockTrips = [
      {
        id: '1',
        origin: targetOrigin,
        destination: targetDestination,
        cost: 300,
        duration: 400,
      },
      {
        id: '2',
        origin: targetOrigin,
        destination: targetDestination,
        cost: 200,
        duration: 500,
      },
      {
        id: '3',
        origin: targetOrigin,
        destination: targetDestination,
        cost: 400,
        duration: 300,
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockTrips });

    const expectedResult = [mockTrips[2], mockTrips[0], mockTrips[1]];

    const request: FindSortedTripsRequest = {
      origin: targetOrigin,
      destination: targetDestination,
      sort_by: FIND_SORTED_TRIPS_SORT_BY_VALUES.FASTEST,
    };

    const result = await tripService.findSortedTrips(request);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${mockEnvs.TRIP_API_URL}${TRIP_API_GET_TRIPS_PATH}`,
      {
        params: {
          [TRIP_API_QUERY_PARAMS.ORIGIN]: targetOrigin,
          [TRIP_API_QUERY_PARAMS.DESTINATION]: targetDestination,
        },
        headers: {
          [TRIP_API_KEY_HEADER]: mockEnvs.TRIP_API_KEY,
        },
      },
    );

    expect(result).toEqual(expectedResult);
  });

  it('should throw a generic error if fetching trips fails', async () => {
    const targetOrigin = SUPPORTED_TRIP_POINTS_LIST[0];
    const targetDestination = SUPPORTED_TRIP_POINTS_LIST[1];

    const request: FindSortedTripsRequest = {
      origin: targetOrigin,
      destination: targetDestination,
      sort_by: FIND_SORTED_TRIPS_SORT_BY_VALUES.CHEAPEST,
    };

    mockedAxios.get.mockRejectedValueOnce(new Error('mocked error'));

    await expect(tripService.findSortedTrips(request)).rejects.toThrow(
      new ApiError({ code: 500, message: 'Failed to fetch trips' }),
    );

    // test also for uncommon error object
    mockedAxios.get.mockRejectedValueOnce('not an error object');

    await expect(tripService.findSortedTrips(request)).rejects.toThrow(
      new ApiError({ code: 500, message: 'Failed to fetch trips' }),
    );
  });
});
