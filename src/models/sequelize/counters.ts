import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface countersAttributes {
  id: number;
  serial_number: string;
  model: string;
  address: string;
}

export type countersPk = "id";
export type countersId = counters[countersPk];
export type countersOptionalAttributes = "id";
export type countersCreationAttributes = Optional<countersAttributes, countersOptionalAttributes>;

export class counters extends Model<countersAttributes, countersCreationAttributes> implements countersAttributes {
  id!: number;
  serial_number!: string;
  model!: string;
  address!: string;


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
      allowNull: false,
      unique: "serial_number"
    },
    model: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
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
      {
        name: "serial_number",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "serial_number" },
        ]
      },
    ]
  });
  }
}
