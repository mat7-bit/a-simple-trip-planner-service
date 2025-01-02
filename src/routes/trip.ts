import { Envs } from '@models/common';
import { FIND_SORTED_TRIPS_PATH } from '@models/constants';
import { TRIPS_FIND_TRIPS_SORTED_BY_PARAM } from '@models/schemas/findSortedTrips';
import { FindSortedTripsRequest } from '@models/trip';
import { TripService } from '@services/trip';
import { FastifyPluginAsync } from 'fastify';

const trips: FastifyPluginAsync = async (fastify): Promise<void> => {
  const service = new TripService({
    env: fastify.getEnvs<Envs>(),
    logger: fastify.log,
  });

  fastify.get<{ Querystring: FindSortedTripsRequest }>(
    `${FIND_SORTED_TRIPS_PATH}`,
    {
      schema: TRIPS_FIND_TRIPS_SORTED_BY_PARAM,
    },
    async function ({ query }) {
      const response = await service.findSortedTrips(query);
      return response;
    },
  );
};

export default trips;
