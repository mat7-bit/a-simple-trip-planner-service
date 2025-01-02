import { createTrip, listTrips } from '@data/trip-repository';
import { ApiError, Envs } from '@models/common';
import {
  TRIP_API_GET_TRIPS_PATH,
  TRIP_API_KEY_HEADER,
  TRIP_API_QUERY_PARAMS,
} from '@models/constants';
import {
  BaseTripRecord,
  FIND_SORTED_TRIPS_SORT_BY_VALUES,
  FindSortedTripsRequest,
  FindTripResponse,
  SUPPORTED_TRIP_POINTS,
  TripRecord,
  TripApiRequest,
  ListTripsResult,
  ListTripsRequest,
} from '@models/trip';
import { toDateType } from '@tools/date';
import axios from 'axios';
import { FastifyBaseLogger } from 'fastify';

export class TripService {
  private env: Envs;

  private logger: FastifyBaseLogger;

  constructor(config: { env: Envs; logger: FastifyBaseLogger }) {
    this.env = config.env;
    this.logger = config.logger;
  }

  private async getTrips(request: TripApiRequest): Promise<FindTripResponse> {
    // call external API
    const endpoint = `${this.env.TRIP_API_URL}${TRIP_API_GET_TRIPS_PATH}`;
    try {
      this.logger.debug(
        `Fetching trips from ${request.origin} to ${request.destination}`,
      );
      const response = await axios.get<FindTripResponse>(endpoint, {
        params: {
          [TRIP_API_QUERY_PARAMS.ORIGIN]: request.origin,
          [TRIP_API_QUERY_PARAMS.DESTINATION]: request.destination,
        },
        headers: {
          [TRIP_API_KEY_HEADER]: this.env.TRIP_API_KEY,
        },
      });
      this.logger.debug(`Fetched ${response?.data?.length} trips`);
      return response?.data;
    } catch (error: unknown) {
      // avoid to expose the internal api error, simply log it
      this.logger.error(
        error instanceof Error
          ? `Failed to fetch trips: ${error.message} - ${error.stack}`
          : 'Failed to fetch trips',
      );
      throw new ApiError({
        code: 500,
        message: 'Failed to fetch trips',
      });
    }
  }

  async findSortedTrips(
    request: FindSortedTripsRequest,
  ): Promise<FindTripResponse> {
    // validate request
    if (!request?.origin || !request?.destination || !request?.sort_by) {
      throw new ApiError({
        code: 400,
        message: 'Parameters origin, destination and sort_by are required',
      });
    }
    if (
      request.sort_by !== FIND_SORTED_TRIPS_SORT_BY_VALUES.CHEAPEST &&
      request.sort_by !== FIND_SORTED_TRIPS_SORT_BY_VALUES.FASTEST
    ) {
      throw new ApiError({
        code: 400,
        message: 'Parameter sort_by must be either cheapest or fastest',
      });
    }
    if (
      !SUPPORTED_TRIP_POINTS.has(request.origin) ||
      !SUPPORTED_TRIP_POINTS.has(request.destination)
    ) {
      throw new ApiError({
        code: 400,
        message:
          'Parameters origin and destination must be one of the supported points',
      });
    }
    this.logger.debug(
      `Fetching trips from ${request.origin} to ${request.destination} sorted by ${request.sort_by}`,
    );
    const { sort_by, ...tripRequest } = request;
    // load trips
    const trips = await this.getTrips(tripRequest);
    // sort trips
    this.logger.debug(`Sorting trips by ${sort_by}`);
    const sortedTrips = trips.sort((a, b) => {
      if (sort_by === FIND_SORTED_TRIPS_SORT_BY_VALUES.CHEAPEST) {
        return a.cost - b.cost;
      } else {
        return a.duration - b.duration;
      }
    });
    this.logger.debug(`Sorted ${sortedTrips.length} trips`);
    return sortedTrips;
  }

  async createTripRecord(request: BaseTripRecord): Promise<TripRecord> {
    // validate request
    if (
      !request?.origin ||
      !request?.destination ||
      !request?.startDate ||
      !request?.createdBy
    ) {
      throw new ApiError({
        code: 400,
        message:
          'Parameters origin, destination, createdBy and startDate are required',
      });
    }
    const { origin, destination, startDate, createdBy, description } = request;
    if (
      !SUPPORTED_TRIP_POINTS.has(origin) ||
      !SUPPORTED_TRIP_POINTS.has(destination)
    ) {
      throw new ApiError({
        code: 400,
        message:
          'Parameters origin and destination must be one of the supported points',
      });
    }
    this.logger.debug(
      `Creating trip record from ${origin} to ${destination} for user ${createdBy}`,
    );
    try {
      // fastify validation ensure that the startDate property is a valid date-time string, but it doesn't parse it
      const parsedStartDate = toDateType(startDate);
      const result = await createTrip({
        origin,
        destination,
        startDate: parsedStartDate,
        createdBy,
        description,
      });
      this.logger.debug(`Created trip record with id ${result.id}`);
      return result;
    } catch (error: unknown) {
      // avoid to expose the internal api error, simply log it
      this.logger.error(
        error instanceof Error
          ? `Failed to create trip record: ${error.message} - ${error.stack}`
          : 'Failed to create trip record',
      );
      throw new ApiError({
        code: 500,
        message: 'Failed to create trip record',
      });
    }
  }

  async listTripRecords(request: ListTripsRequest): Promise<ListTripsResult> {
    // validate request
    if (!request?.createdBy) {
      throw new ApiError({
        code: 400,
        message: 'Parameter createdBy is required',
      });
    }
    this.logger.debug(`Listing trips for user ${request.createdBy}`);
    try {
      const result = await listTrips(request);
      this.logger.debug(`Found ${result.trips.length}/${result.total} trips`);
      return result;
    } catch (error: unknown) {
      this.logger.error(
        error instanceof Error
          ? `Failed to list trips: ${error.message} - ${error.stack}`
          : 'Failed to list trips',
      );
      throw new ApiError({
        code: 500,
        message: 'Failed to list trips',
      });
    }
  }
}
