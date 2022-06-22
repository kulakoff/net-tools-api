import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/apiError";
export type ActionTypeValue = "SEND_REPORT" | "CHECK_DATA_REPORT";
export interface IActionBody {
  action: ActionTypeValue;
}

class MainController {
  async sendReport(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("sendReport >>>");
      
      const { action }:IActionBody = req.body;
      console.log("action",action);
      switch (action) {
        case "SEND_REPORT":
          console.log("Выполнить отправку отчета в сбытовую компанию")
          break;
          case "CHECK_DATA_REPORT":
            console.log("Проверка данных перед отправкой отчета")
            break;
      
        default:
          break;
      }
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      next(ApiError.BadRequest("Непредвиденная ошибка"));
    }
  }
}

export default new MainController();
