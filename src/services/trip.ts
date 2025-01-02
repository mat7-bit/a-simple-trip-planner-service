import { ApiError, Envs } from '@models/common';
import {
  TRIP_API_GET_TRIPS_PATH,
  TRIP_API_KEY_HEADER,
  TRIP_API_QUERY_PARAMS,
} from '@models/constants';
import {
  FIND_SORTED_TRIPS_SORT_BY_VALUES,
  FindSortedTripsRequest,
  FindTripResponse,
  SUPPORTED_TRIP_POINTS,
  TripApiRequest,
} from '@models/trip';
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
}
