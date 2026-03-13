import { DataTypes, Model, type Sequelize } from 'sequelize';

export enum VacancyMode {
  Online = 'online',
  Offline = 'offline',
  Hybrid = 'hybrid',
}

export enum VacancyType {
  Internship = 'internship',
  Job = 'job',
}

export type VacancyAttributes = {
  id: string;
  employerId: string;
  description: string;
  company: string;
  location: string;
  mode: VacancyMode;
  type: VacancyType;
  salary: number;
  isExpired: boolean;
  startDate: string;
  endDate: string;
  createdAt: Date;
  updatedAt: Date;
};

export type VacancyCreationAttributes = Omit<VacancyAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class VacancyModel extends Model<VacancyAttributes, VacancyCreationAttributes> {}

export const initVacancyModel = (sequelize: Sequelize) => {
  VacancyModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'id',
      },
      employerId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'employer_id',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      company: {
        type: DataTypes.STRING(160),
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(160),
        allowNull: false,
      },
      mode: {
        type: DataTypes.ENUM(...Object.values(VacancyMode)),
        allowNull: false,
        field: 'mode',
      },
      type: {
        type: DataTypes.ENUM(...Object.values(VacancyType)),
        allowNull: false,
      },
      salary: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isExpired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_expired',
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'start_date',
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'end_date',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'vacancies',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [{ fields: ['employer_id'] }, { fields: ['is_expired'] }],
    },
  );

  return VacancyModel;
};
