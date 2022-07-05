import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/apiError";
import CountersService, { IModiFyValues } from "../service/countersService";
import mailApiService from "../service/mailApiService";
import mailService from "../service/mailService";
import reportService from "../service/reportService";
import { ICounterDataItem, IDataForReport } from "../types/counters";

export type ActionTypeValue =
  | "SEND_REPORT"
  | "CHECK_REPORT_DATA"
  | "RENDER_REPORT";
export interface IActionBody {
  action: ActionTypeValue;
}

class ReportController {
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

        case "SEND_REPORT": {
          //сделать запись в тамлице reports об успешно отпраленном отчете //2 сгенерировать файл отчета и отправить на почту в сбытовую компанию
          console.log("Выполнить отправку отчета в сбытовую компанию");
          res.json({
            message: "Выполнить отправку отчета в сбытовую компанию",
          });
        }

        case "RENDER_REPORT": {
          //Получаем  данные из БД
          const report = await CountersService.getReport();
          // Дополняем данные
          if (report) {
            //TODO: добавить 
            const makeReportData: IDataForReport = {
              user: "ООО ЛАНТА",
              currentDate: new Date().toLocaleDateString("RU"),
              meters: report,
            };

            //создаем файл отчета
            await reportService.renderReport(makeReportData)
              .then(async (renderResult) => {
                if (renderResult.fileName) {
                  //отправка на почту
                  // const sendEmail = await mailApiService.sendReportMail('anton.kulakoff@ya.ru', renderResult.fileName)
                  const sendEmail_nodemailer = await mailService.sendReport('anton.kulakoff@ya.ru', renderResult.fileName)
                  // console.log(sendEmail)
                  console.log(sendEmail_nodemailer)
                  res.json({ message: "report sended", 
                  // status: sendEmail.data.status, 
                  nodemailer: sendEmail_nodemailer })
                }
              })


          }
          // отправляем данные для рендера отчета
          // await reportService.renderReport();
        }

        // default:
        //   res.sendStatus(200);
      }
      // res.sendStatus(200);
    } catch (error) {
      console.log(error);
      next(ApiError.BadRequest("Непредвиденная ошибка"));
    }
  }
}

export default new ReportController();
