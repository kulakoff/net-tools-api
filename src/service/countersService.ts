//mysql
import { QueryTypes } from "sequelize"
import sequelize from "../dbConnections/sequelize";
import sequelizeConnection from "../dbConnections/sequelize";
import {
  initModels,
  counters,
  counters_data,
} from "../models/sequelize/init-models";
initModels(sequelizeConnection);

import { iCounterItem, counterModel } from "../types/counters";

export interface IgetCounterDataHistory {
  id: number,
  limit?: number
}

export interface IModiFyValues {
  model?: counterModel;
  addresses?: string;
}

export interface ISetCounter {
  id: string;
  payload: IModiFyValues;
}
export interface IMeterReadings {
  id: number;
  value: string;
}
export interface IMeterReadings2 {
  serial_number: string;
  value: string;
}

class CountersService {
  //Вывод всех приборов учета
  async getAll() {
    try {
      console.log("Вывод всех приборов учета");
      const allCoutners = await counters.findAll();
      return allCoutners;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //Вывод информации о приборе учета
  async getCounter(id: number) {
    try {
      console.log("Вывод информации о приборе учета по его ID");
      const counterData = await counters.findByPk(id);
      return counterData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //Обновление информации о приборе учета
  async setCounter(id: number, payload: IModiFyValues) {
    try {
      console.log("Обновление информции");
      // console.log("ID:", id, "PAYLOAD: ", payload);
      const result = await counters.update(payload, { where: { id } });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //Добавление прибора учета
  async addCounter({ serial_number, model, address }: iCounterItem) {
    try {
      console.log("CountersService.addCounter | Добавление прибора учета");
      const newCounter = await counters.create({
        serial_number,
        model,
        address,
      });
      return newCounter;
    } catch (error: any) {
      console.log(error);
      return { message: error.errors[0].message };
    }
  }

  //Удаление прибора учета
  async removeCounter(id: number) {
    try {
      console.log(`removeCounter. Удаление прибора учета ${id}`);
      const result = await counters.destroy({ where: { id } });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * Вывод последних показаний прибора учета
   * @id запрашиваемого прибора цчета
   */
  async getCounterData(id: number) {
    try {
      console.log("Вывод показаний прибора учета");
      const result = await counters.findAll({
        where: { id },
        include: [
          {
            model: counters_data,
            as: "counters_data",
            attributes: ["value", "timestamp"],
          },
        ],
        raw: true,
        nest: true,
        limit: 1,
        subQuery: false,
      });
      // console.log("SQL res: ",result)
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }



  /**
 * Вывод истории показаний прибора учета
 * @id запрашиваемого прибора цчета
 * @limit по-умолчанию 12
 */
  async getCounterDataHistory({id, limit = 12}:IgetCounterDataHistory ) {
    try {
      console.log("Вывод истории показаний прибора учета");
      const result = await counters_data.findAll({
        attributes: ["id", "value", "timestamp"],
        where: { counter_id: id },
        // raw: true,
        // nest: true,
        limit,
        order: [['timestamp', 'DESC']]
        // subQuery: false,
      });
      // console.log("SQL res: ",result)
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * Запись показаний прибора учета в БД
   * Не используется
   */
  async saveCounterData_byId({ id, value }: IMeterReadings) {
    try {
      console.log("sendMeters input props> : ", id, value);
      const newMeters = await counters_data.create({ counter_id: id, value });
      return newMeters;
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }

  /**
   * Запись показаний прибора учета в БД
   * TODO: переделать на синаксис ORM
   */
  async saveCounterData({ serial_number, value }: IMeterReadings2) {
    try {
      const res = await counters_data.create({
        value, counter_id:
          await counters.findOne({ attributes: ["id"], where: { serial_number } })
            .then(({ id }: any) => id ? id : null)
      });
      return res;
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }

  async saveCounterData_test({ serial_number, value }: IMeterReadings2) {
    try {
      const [results, metadata] = await sequelize.query(`
       INSERT INTO counters_data (counter_id, value)
       SELECT counters.id  AS counter_id , ${value} as value 
       FROM counters
       WHERE counters.serial_number = ${serial_number};
       `, {
        type: QueryTypes.INSERT, raw: true, nest: true,
      });
      console.log(results, metadata)
      return "res";
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }
}

export default new CountersService();
