import type { Sequelize } from "sequelize";
import { counters as _counters } from "./counters";
import type { countersAttributes, countersCreationAttributes } from "./counters";
import { counters_data as _counters_data } from "./counters_data";
import type { counters_dataAttributes, counters_dataCreationAttributes } from "./counters_data";
import { customers as _customers } from "./customers";
import type { customersAttributes, customersCreationAttributes } from "./customers";
import { providers as _providers } from "./providers";
import type { providersAttributes, providersCreationAttributes } from "./providers";
import { reports as _reports } from "./reports";
import type { reportsAttributes, reportsCreationAttributes } from "./reports";

export {
  _counters as counters,
  _counters_data as counters_data,
  _customers as customers,
  _providers as providers,
  _reports as reports,
};

export type {
  countersAttributes,
  countersCreationAttributes,
  counters_dataAttributes,
  counters_dataCreationAttributes,
  customersAttributes,
  customersCreationAttributes,
  providersAttributes,
  providersCreationAttributes,
  reportsAttributes,
  reportsCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const counters = _counters.initModel(sequelize);
  const counters_data = _counters_data.initModel(sequelize);
  const customers = _customers.initModel(sequelize);
  const providers = _providers.initModel(sequelize);
  const reports = _reports.initModel(sequelize);

  counters_data.belongsTo(counters, { as: "counter", foreignKey: "counter_id"});
  counters.hasMany(counters_data, { as: "counters_data", foreignKey: "counter_id"});

  return {
    counters: counters,
    counters_data: counters_data,
    customers: customers,
    providers: providers,
    reports: reports,
  };
}
