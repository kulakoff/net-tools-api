import type { Sequelize } from "sequelize";
import { counters as _counters } from "./counters";
import type { countersAttributes, countersCreationAttributes } from "./counters";
import { counters_data as _counters_data } from "./counters_data";
import type { counters_dataAttributes, counters_dataCreationAttributes } from "./counters_data";

export {
  _counters as counters,
  _counters_data as counters_data,
};

export type {
  countersAttributes,
  countersCreationAttributes,
  counters_dataAttributes,
  counters_dataCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const counters = _counters.initModel(sequelize);
  const counters_data = _counters_data.initModel(sequelize);

  counters_data.belongsTo(counters, { as: "counter", foreignKey: "counter_id"});
  counters.hasMany(counters_data, { as: "counters_data", foreignKey: "counter_id"});

  return {
    counters: counters,
    counters_data: counters_data,
  };
}
