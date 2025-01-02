/* eslint-disable @typescript-eslint/no-explicit-any */
import { TripService } from './trip';
import axios from 'axios';
import {
  BaseTripRecord,
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
import { createTrip, listTrips } from '@data/trip-repository';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('@data/trip-repository', () => ({
  createTrip: jest.fn(),
  listTrips: jest.fn(),
}));

const mockedCreateTrip = createTrip as jest.Mock;
const mockedListTrips = listTrips as jest.Mock;

const mockEnvs: Partial<Envs> = {
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
      env: mockEnvs as unknown as Envs,
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

describe('TripService createTripRecord method', () => {
  let tripService: TripService;

  beforeEach(() => {
    tripService = new TripService({
      env: mockEnvs as unknown as Envs,
      logger: mockedLogger as any,
    });
    jest.clearAllMocks();
  });

  it('should throw 400 error if trip request is invalid', async () => {
    const invalidRequests = [
      { origin: 'ABC', destination: 'ABC', startDate: new Date() },
      { origin: 'ABC', destination: 'DEF', createdBy: 'someone' },
      { origin: 'ABC', startDate: new Date(), createdBy: 'someone' },
      { destination: 'ABC', startDate: new Date(), createdBy: 'someone' },
      null,
      {},
    ] as BaseTripRecord[];

    for (const invalidRequest of invalidRequests) {
      await expect(
        tripService.createTripRecord(invalidRequest as any),
      ).rejects.toThrow(
        new ApiError({
          code: 400,
          message:
            'Parameters origin, destination, createdBy and startDate are required',
        }),
      );
    }

    const invalidRequestsWithNotExistingPoints = [
      // unsupported destination
      {
        origin: SUPPORTED_TRIP_POINTS_LIST[0],
        destination: 'ABC',
        startDate: new Date(),
        createdBy: 'someone',
      },
      // unsupported origin
      {
        destination: SUPPORTED_TRIP_POINTS_LIST[0],
        origin: 'ABC',
        startDate: new Date(),
        createdBy: 'someone',
      },
    ];

    for (const invalidRequest of invalidRequestsWithNotExistingPoints) {
      await expect(
        tripService.createTripRecord(invalidRequest as any),
      ).rejects.toThrow(
        new ApiError({
          code: 400,
          message:
            'Parameters origin and destination must be one of the supported points',
        }),
      );
    }
  });

  it('should create a trip and return it', async () => {
    const request = {
      origin: SUPPORTED_TRIP_POINTS_LIST[0],
      destination: SUPPORTED_TRIP_POINTS_LIST[1],
      startDate: '2021-01-01T00:00:00.000Z',
      createdBy: 'someone',
      description: 'mocked trip',
    };

    const mockedResult = {
      ...request,
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null as unknown as Date,
    };

    mockedCreateTrip.mockResolvedValueOnce(mockedResult);

    const result = await tripService.createTripRecord(
      request as unknown as BaseTripRecord,
    );

    expect(mockedCreateTrip).toHaveBeenCalledWith({
      origin: request.origin,
      destination: request.destination,
      startDate: new Date(request.startDate),
      createdBy: request.createdBy,
      description: request.description,
    });

    expect(result).toEqual(mockedResult);
  });

  it('should throw a generic error if creating a trip fails', async () => {
    const request = {
      origin: SUPPORTED_TRIP_POINTS_LIST[0],
      destination: SUPPORTED_TRIP_POINTS_LIST[1],
      startDate: '2021-01-01T00:00:00.000Z',
      createdBy: 'someone',
      description: 'mocked trip',
    };

    mockedCreateTrip.mockRejectedValueOnce(new Error('mocked error'));

    await expect(tripService.createTripRecord(request as any)).rejects.toThrow(
      new ApiError({ code: 500, message: 'Failed to create trip record' }),
    );

    // test also for uncommon error object
    mockedCreateTrip.mockRejectedValueOnce('not an error object');

    await expect(tripService.createTripRecord(request as any)).rejects.toThrow(
      new ApiError({ code: 500, message: 'Failed to create trip record' }),
    );
  });
});

describe('TripService listTripRecords method', () => {
  let tripService: TripService;

  beforeEach(() => {
    tripService = new TripService({
      env: mockEnvs as unknown as Envs,
      logger: mockedLogger as any,
    });
    jest.clearAllMocks();
  });

  it('should throw 400 error if list request is invalid', async () => {
    const invalidRequests = [null, {}] as any[];

    for (const invalidRequest of invalidRequests) {
      await expect(
        tripService.listTripRecords(invalidRequest as any),
      ).rejects.toThrow(
        new ApiError({
          code: 400,
          message: 'Parameter createdBy is required',
        }),
      );
    }
  });

  it('should list trips', async () => {
    const request = {
      createdBy: 'someone',
    };

    const mockedResult = {
      trips: [
        {
          origin: SUPPORTED_TRIP_POINTS_LIST[0],
          destination: SUPPORTED_TRIP_POINTS_LIST[1],
          startDate: '2021-01-01T00:00:00.000Z',
          createdBy: request.createdBy,
          description: 'mocked trip',
          id: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null as unknown as Date,
        },
      ],
      page: 1,
      limit: 10,
      total: 1,
    };

    mockedListTrips.mockResolvedValueOnce(mockedResult);

    const result = await tripService.listTripRecords(request as any);

    expect(mockedListTrips).toHaveBeenCalledWith({
      createdBy: request.createdBy,
    });

    expect(result).toEqual(mockedResult);
  });

  it('should list trips using pagination input', async () => {
    const request = {
      createdBy: 'someone',
      page: 1,
      limit: 10,
    };

    const mockedResult = {
      trips: [
        {
          origin: SUPPORTED_TRIP_POINTS_LIST[0],
          destination: SUPPORTED_TRIP_POINTS_LIST[1],
          startDate: '2021-01-01T00:00:00.000Z',
          createdBy: request.createdBy,
          description: 'mocked trip',
          id: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null as unknown as Date,
        },
      ],
      page: request.page,
      limit: request.limit,
      total: 1,
    };

    mockedListTrips.mockResolvedValueOnce(mockedResult);

    const result = await tripService.listTripRecords(request as any);

    expect(mockedListTrips).toHaveBeenCalledWith(request);

    expect(result).toEqual(mockedResult);
  });

  it('should throw a generic error if listing trips fails', async () => {
    const request = {
      createdBy: 'someone',
    };

    mockedListTrips.mockRejectedValueOnce(new Error('mocked error'));

    await expect(tripService.listTripRecords(request as any)).rejects.toThrow(
      new ApiError({ code: 500, message: 'Failed to list trips' }),
    );

    // test also for uncommon error object
    mockedListTrips.mockRejectedValueOnce('not an error object');

    await expect(tripService.listTripRecords(request as any)).rejects.toThrow(
      new ApiError({ code: 500, message: 'Failed to list trips' }),
    );
  });
});
