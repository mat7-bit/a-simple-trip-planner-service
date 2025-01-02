import { Envs } from '@models/common';
import { MANAGER_BASE_PATH } from '@models/constants';
import { MANAGER_CREATE_TRIP_RECORD } from '@models/schemas/createTripRecord';
import { BaseTripRecord, ListTripsRequest } from '@models/trip';
import { TripService } from '@services/trip';
import { FastifyPluginAsync } from 'fastify';
import dbConnect from '@plugins/db-connect';
import { MANAGER_LIST_TRIP_RECORDS } from '@models/schemas/listTripRecords';
import { MANAGER_DELETE_TRIP_RECORD } from '@models/schemas/deleteTripRecord';

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

  fastify.get<{ Querystring: ListTripsRequest }>(
    `${MANAGER_BASE_PATH}/trips`,
    {
      schema: MANAGER_LIST_TRIP_RECORDS,
    },
    async function ({ query }) {
      const response = await service.listTripRecords(query);
      return response;
    },
  );

  fastify.delete<{ Params: { id: string } }>(
    `${MANAGER_BASE_PATH}/trips/:id`,
    {
      schema: MANAGER_DELETE_TRIP_RECORD,
    },
    async function ({ params }) {
      const response = await service.deleteTripRecord(params?.id);
      return response;
    },
  );
};

export default manager;
