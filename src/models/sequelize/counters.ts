import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { counters_data, counters_dataId } from './counters_data';

export interface countersAttributes {
  id: number;
  serial_number: string;
  model: string;
  address: string;
  telemetry: number;
  card_number?: string;
}

export type countersPk = "id";
export type countersId = counters[countersPk];
export type countersOptionalAttributes = "id" | "telemetry" | "card_number";
export type countersCreationAttributes = Optional<countersAttributes, countersOptionalAttributes>;

export class counters extends Model<countersAttributes, countersCreationAttributes> implements countersAttributes {
  id!: number;
  serial_number!: string;
  model!: string;
  address!: string;
  telemetry!: number;
  card_number?: string;

  // counters hasMany counters_data via counter_id
  counters_data!: counters_data[];
  getCounters_data!: Sequelize.HasManyGetAssociationsMixin<counters_data>;
  setCounters_data!: Sequelize.HasManySetAssociationsMixin<counters_data, counters_dataId>;
  addCounters_datum!: Sequelize.HasManyAddAssociationMixin<counters_data, counters_dataId>;
  addCounters_data!: Sequelize.HasManyAddAssociationsMixin<counters_data, counters_dataId>;
  createCounters_datum!: Sequelize.HasManyCreateAssociationMixin<counters_data>;
  removeCounters_datum!: Sequelize.HasManyRemoveAssociationMixin<counters_data, counters_dataId>;
  removeCounters_data!: Sequelize.HasManyRemoveAssociationsMixin<counters_data, counters_dataId>;
  hasCounters_datum!: Sequelize.HasManyHasAssociationMixin<counters_data, counters_dataId>;
  hasCounters_data!: Sequelize.HasManyHasAssociationsMixin<counters_data, counters_dataId>;
  countCounters_data!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof counters {
    return counters.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    serial_number: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    model: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telemetry: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    card_number: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'counters',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
