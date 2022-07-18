import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface reportsAttributes {
  id: number;
  customer_id: number;
  provider_id: number;
  timestamp: Date;
}

export type reportsPk = "id";
export type reportsId = reports[reportsPk];
export type reportsOptionalAttributes = "id" | "timestamp";
export type reportsCreationAttributes = Optional<reportsAttributes, reportsOptionalAttributes>;

export class reports extends Model<reportsAttributes, reportsCreationAttributes> implements reportsAttributes {
  id!: number;
  customer_id!: number;
  provider_id!: number;
  timestamp!: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof reports {
    return reports.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    provider_id: {
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
    tableName: 'reports',
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
        name: "reports_customer_id_IDX",
        using: "BTREE",
        fields: [
          { name: "customer_id" },
        ]
      },
      {
        name: "reports_provider_id_IDX",
        using: "BTREE",
        fields: [
          { name: "provider_id" },
        ]
      },
    ]
  });
  }
}
