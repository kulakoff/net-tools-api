import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface counters_dataAttributes {
  id: number;
  counter_id: number;
  value: number;
  timestamp: Date;
}

export type counters_dataPk = "id";
export type counters_dataId = counters_data[counters_dataPk];
export type counters_dataOptionalAttributes = "id" | "timestamp";
export type counters_dataCreationAttributes = Optional<counters_dataAttributes, counters_dataOptionalAttributes>;

export class counters_data extends Model<counters_dataAttributes, counters_dataCreationAttributes> implements counters_dataAttributes {
  id!: number;
  counter_id!: number;
  value!: number;
  timestamp!: Date;


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
      allowNull: false
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false
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