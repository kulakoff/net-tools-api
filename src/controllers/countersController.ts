import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/apiError";
import CountersService, { IModiFyValues } from "../service/countersService";
import { iCounterItem } from "../types/counters";

// const metersService = require("./../services/")
class CountersController {
  // async sendCountersData(req: Request, res: Response, next: NextFunction) {
  //   console.log(req.body);
  //   res.json(req.body);
  // }
  /**
   *Получить все приборы учета
   */
  async getItems(req: Request, res: Response, next: NextFunction) {
    console.log("CountersController.getMeters");
    console.log("Получение данных о всех счетчиках");
    const counters = await CountersService.getAll();
    res.json(counters);
  }
  /**
   *Найти прибора учета по id
   */
  async getItem(req: Request, res: Response, next: NextFunction) {
    console.log(req.params);

    if (req.params.id) {
      console.log("CountersController.getCountersItem");
      console.log(`Получение данных о счетчике с ID: ${req.params.id}`);
      const counterData = await CountersService.getCounter(+req.params.id);
      res.json(counterData);
    }
  }
  /**
   *Найти показания прибора учета по id
   если отсутствует req.query.timestamp  товернуть последнее значение счетчика.
   При наличии req.query.timestamp  вывести 
   */
  async getItemData(req: Request, res: Response, next: NextFunction) {
    // console.log("req.params>> ", req.params);
    // console.log("req.query>> ", req.query);
    try {
      if (req.params && req.params.id) {
        const { id } = req.params;
        const { timestamp } = req.query;
        if (req.query.timestamp) {
          //преобразовать дату
          console.log("timestamp exist !!!");
          console.log({ id, timestamp });
          res.json({ message: "timestamp exist" });
        } else {
          // next(ApiError.BadRequest("timestamp not found"))
          if (+id) {
            const response = await CountersService.getCounterData(+id);
            next(res.json(response));
          } else {
            next(ApiError.BadRequest("Не верынй id"));
          }
        }
      }
    } catch (error) {
      console.log(error);

      next(ApiError.BadRequest("Непредвиденная ошибка"));
    }
  }

  /**
   *Изменить данные прибора учета
   */
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
  /**
   *Удаление прибора учета
   */
  async removeItem(req: Request, res: Response, next: NextFunction) {
    console.log("CountersController.removeItem");
    if (req.body.id) {
      console.log("CountersController.removeItem");
      console.log(`Удалить прибор усета с ID: ${req.body.id}`);
      const request = await CountersService.removeCounter(+req.body.id);
      res.json(request);
    }
  }
  /**
   *Добавление нового прибора учета
   */
  async newItem(req: Request, res: Response, next: NextFunction) {
    if (req.body.counter) {
      const { counter } = req.body;
      console.log("CountersController.newItem");
      console.log(`Добавление прибора учета`);
      const newItem = await CountersService.addCounter(counter);
      res.json(newItem);
    }
  }

  /**
 *Отправка показаний приборов учета по ID  прибора учета!
 Переделать
 */
  async sendMeters(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("sendMeters2: ", req.body);
      // req.body.payload = {...req.body.data}
      if (req.body.payload && req.body.payload.value) {
        const { serial_number, value } = req.body.payload;
        const response = await CountersService.saveCounterData({
          serial_number,
          value,
        });
        res.json(response);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async sendMeters2(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("sendMeters2: ", req.body);
      // req.body.payload = {...req.body.data}
      if (
        req.body.payload &&
        req.body.payload.value &&
        req.body.payload.serial_number
      ) {
        const { serial_number, value } = req.body.payload;
        const response = await CountersService.saveCounterData2({
          serial_number,
          value,
        });
        res.json(response);
      }
      next(ApiError.BadRequest("Не верыное тело запроса"));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async sendMetersById(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("sendMeters2: ", req.body);
      // req.body.payload = {...req.body.data}
      if (req.body.payload && req.body.payload.value) {
        const { id, value } = req.body.payload;
        const response = await CountersService.saveCounterData_byId({
          id,
          value,
        });
        res.json(response);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default new CountersController();
