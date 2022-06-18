//mysql
import sequelizeConnection from "../dbConnections/sequelize";
import {
  initModels,
  counters,
  counters_data,
} from "../models/sequelize/init-models";
initModels(sequelizeConnection);

import { iCounterItem, counterModels } from "../types/counters";

export interface IModiFyValues {
  model?: counterModels;
  addresses?: string;
}

export interface ISetCounter {
  id: string;
  payload: IModiFyValues;
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

  //Вывод показаний прибора учета
  async getCounterData() {
    try {
      console.log("Вывод показаний прибора учета");
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new CountersService();
