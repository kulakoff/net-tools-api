import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/apiError";
import CountersService, { IModiFyValues } from "../service/countersService";

export type ActionTypeValue = "SEND_REPORT" | "CHECK_REPORT_DATA";
export interface IActionBody {
  action: ActionTypeValue;
}

class MainController {
  async sendReport(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("sendReport >>>");

      const { action }: IActionBody = req.body;
      console.log("action", action);
      switch (action) {
        case "CHECK_REPORT_DATA": {
          //1 сделать выборку из БД с данными для отчета
          console.log("Проверка данных перед отправкой отчета");
          const report = await CountersService.getReport();
          res.json(report);
        }

        case "SEND_REPORT": //сделать запись в тамлице reports об успешно отпраленном отчете //2 сгенерировать файл отчета и отправить на почту в сбытовую компанию
        {
          console.log("Выполнить отправку отчета в сбытовую компанию");
          res.json({
            message: "Выполнить отправку отчета в сбытовую компанию",
          });
        }

        default:
          res.sendStatus(200);
      }
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      next(ApiError.BadRequest("Непредвиденная ошибка"));
    }
  }
}

export default new MainController();
