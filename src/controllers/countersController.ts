import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/apiError";
import CountersService, { IModiFyValues } from "../service/countersService";
import { iCounterItem } from "../types/counters";

// const metersService = require("./../services/")
class CountersController {
  async sendCountersData(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);
    res.json(req.body);
  }

  async getItems(req: Request, res: Response, next: NextFunction) {
    console.log("CountersController.getMeters");
    console.log("Получение данных о всех счетчиках");
    const counters = await CountersService.getAll();
    res.json(counters);
  }

  async getItem(req: Request, res: Response, next: NextFunction) {
    console.log(req.params);

    if (req.params.id) {
      console.log("CountersController.getCountersItem");
      console.log(`Получение данных о счетчике с ID: ${req.params.id}`);
      const counterData = await CountersService.getCounter(+req.params.id);
      res.json(counterData);
    }
  }

  async setItem(req: Request, res: Response, next: NextFunction) {
    console.log("req.body: ", req.body);
    console.log("req.params: ", req.params.id);

    if (req.body.update && req.params.id) {
      const { update } = req.body;
      const { id } = req.params;
      console.log("CountersController.setItem");
      console.log(`Изменить даные прибора учета с ID: ${id}`);
      console.log("payload: ", { id, update });
      const response = await CountersService.setCounter(+id, update);
      res.json(response);
    }
  }

  async removeItem(req: Request, res: Response, next: NextFunction) {
    console.log("CountersController.removeItem");
    if (req.body.id) {
      console.log("CountersController.removeItem");
      console.log(`Удалить прибор усета с ID: ${req.body.id}`);
      const request = await CountersService.removeCounter(+req.body.id);
      res.json(request);
    }
  }

  async newItem(req: Request, res: Response, next: NextFunction) {
    if (req.body.counter) {
      const { counter } = req.body;
      console.log("CountersController.newItem");
      console.log(`Добавление прибора учета`);
      const newItem = await CountersService.addCounter(counter);
      res.json(newItem);
    }
  }
}

export default new CountersController();
