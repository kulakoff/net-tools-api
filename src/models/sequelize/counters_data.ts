import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { counters, countersId } from './counters';

export interface counters_dataAttributes {
  id: number;
  counter_id: number;
  value?: string;
  timestamp: Date;
}

export type counters_dataPk = "id";
export type counters_dataId = counters_data[counters_dataPk];
export type counters_dataOptionalAttributes = "id" | "value" | "timestamp";
export type counters_dataCreationAttributes = Optional<counters_dataAttributes, counters_dataOptionalAttributes>;

export class counters_data extends Model<counters_dataAttributes, counters_dataCreationAttributes> implements counters_dataAttributes {
  id!: number;
  counter_id!: number;
  value?: string;
  timestamp!: Date;

  // counters_data belongsTo counters via counter_id
  counter!: counters;
  getCounter!: Sequelize.BelongsToGetAssociationMixin<counters>;
  setCounter!: Sequelize.BelongsToSetAssociationMixin<counters, countersId>;
  createCounter!: Sequelize.BelongsToCreateAssociationMixin<counters>;

  static initModel(sequelize: Sequelize.Sequelize): typeof counters_data {
    return counters_data.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    counter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'counters',
        key: 'id'
      }
    },
    value: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'counters_data',
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
      {
        name: "counter_id",
        using: "BTREE",
        fields: [
          { name: "counter_id" },
        ]
      },
    ]
  });
  }
}
