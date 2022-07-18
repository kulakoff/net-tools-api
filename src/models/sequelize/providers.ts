import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface providersAttributes {
  id: number;
  name: string;
  address: string;
  email: string;
}

export type providersPk = "id";
export type providersId = providers[providersPk];
export type providersOptionalAttributes = "id";
export type providersCreationAttributes = Optional<providersAttributes, providersOptionalAttributes>;

export class providers extends Model<providersAttributes, providersCreationAttributes> implements providersAttributes {
  id!: number;
  name!: string;
  address!: string;
  email!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof providers {
    return providers.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "email"
    }
  }, {
    sequelize,
    tableName: 'providers',
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
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
  }
}
