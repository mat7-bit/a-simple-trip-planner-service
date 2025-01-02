import { PAGINATION_DEFAULT_PARAMS } from '@models/common';
import {
  BaseTripRecord,
  ListTripsRequest,
  ListTripsResult,
  TripRecord,
} from '@models/trip';
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

class TripRecordModel extends Model<
  InferAttributes<TripRecordModel>,
  InferCreationAttributes<TripRecordModel>
> {
  declare id: string;
  declare description: string;
  declare origin: string;
  declare destination: string;
  declare startDate: Date;
  declare createdBy: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date;
}

export const registerTripModels = (sequelize: Sequelize): void => {
  TripRecordModel.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      origin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      destination: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Trip',
      tableName: 'trips',
      paranoid: true,
      timestamps: true,
    },
  );
};

export const createTrip = async (
  request: BaseTripRecord,
): Promise<TripRecord> => {
  const now = new Date();
  const trip = await TripRecordModel.create({
    ...request,
    createdAt: now,
    updatedAt: now,
  });
  return trip.toJSON();
};

export const listTrips = async ({
  createdBy,
  page,
  limit: optLimit,
}: ListTripsRequest): Promise<ListTripsResult> => {
  const limit = optLimit || PAGINATION_DEFAULT_PARAMS.LIMIT;
  const offset =
    (page > 0 ? (page || PAGINATION_DEFAULT_PARAMS.PAGE) - 1 : 0) * limit;
  const pagination = { limit, offset };
  const result = await TripRecordModel.findAndCountAll({
    where: {
      createdBy,
      deletedAt: null,
    },
    order: [['updatedAt', 'DESC']],
    ...pagination,
  });
  return {
    trips: result.rows.map(trip => trip.toJSON()),
    page: page || PAGINATION_DEFAULT_PARAMS.PAGE,
    limit,
    total: result.count,
  };
};

export const deleteTripById = async (id: string): Promise<boolean> => {
  const deleteCount = await TripRecordModel.destroy({
    where: {
      id,
    },
  });
  return deleteCount > 0;
};
