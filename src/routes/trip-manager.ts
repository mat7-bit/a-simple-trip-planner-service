import { Envs } from '@models/common';
import { MANAGER_BASE_PATH } from '@models/constants';
import { MANAGER_CREATE_TRIP_RECORD } from '@models/schemas/createTripRecord';
import { BaseTripRecord } from '@models/trip';
import { TripService } from '@services/trip';
import { FastifyPluginAsync } from 'fastify';
import dbConnect from '@plugins/db-connect';

const manager: FastifyPluginAsync = async (fastify): Promise<void> => {
  // register db connection plugin
  await fastify.register(dbConnect);

  const service = new TripService({
    env: fastify.getEnvs<Envs>(),
    logger: fastify.log,
  });

  fastify.post<{ Body: BaseTripRecord }>(
    `${MANAGER_BASE_PATH}/trips`,
    {
      schema: MANAGER_CREATE_TRIP_RECORD,
    },
    async function ({ body }) {
      const response = await service.createTripRecord(body);
      return response;
    },
  );
};

export default manager;
