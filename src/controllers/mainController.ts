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
      console.log(req.body);
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      next(ApiError.BadRequest("Непредвиденная ошибка"));
    }
  }
}

export default new MainController();
