import { BaseTripRecord, TripRecord } from '@models/trip';
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