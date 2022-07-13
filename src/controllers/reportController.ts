import { rejects } from "assert";
import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/apiError";
import countersService from "../service/countersService";
import CountersService, { IModiFyValues } from "../service/countersService";
import mailApiService from "../service/mailApiService";
import mailService from "../service/mailService";
import reportService from "../service/reportService";
import zabbixApiService from "../service/zabbixApiService";
import { ICounterDataItem, IDataForReport } from "../types/counters";
import { IResponseCounterItem } from "../types/zabbixApiREsponse";

export type ActionTypeValue =
  | "REPORT_SEND"
  | "REPORT_CHECK_DATA"
  | "REPORT_SEND_TO_EMAIL"
  | "REPORT_GET_DATA";
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
        case "REPORT_CHECK_DATA": 
          //1 сделать выборку из БД с данными для отчета
          console.log("Проверка данных перед отправкой отчета");
          const reportFromDb = await CountersService.getReport();
          res.json(reportFromDb);
          break
        

        case "REPORT_SEND": 
          //сделать запись в тамлице reports об успешно отпраленном отчете //2 сгенерировать файл отчета и отправить на почту в сбытовую компанию
          console.log("Выполнить отправку отчета в сбытовую компанию");
          res.json({
            message: "Выполнить отправку отчета в сбытовую компанию",
          });
          break

        case "REPORT_SEND_TO_EMAIL": 
          //Получаем  данные из БД
          const report = await CountersService.getReport();
          // Дополняем данные из БД для фломарования отчета
          if (report) {
            //TODO: добавить
            const makeReportData: IDataForReport = {
              user: "ООО ЛАНТА",
              currentDate: new Date().toLocaleDateString("RU"),
              meters: report,
            };

            //создаем файл отчета
            await reportService
              .renderReport(makeReportData)
              .then(async (renderResult: any) => {
                if (renderResult.fileName) {
                  //отправка на почту
                  // const sendEmail = await mailApiService.sendReportMail('anton.kulakoff@ya.ru', renderResult.fileName)
                  const sendEmail_nodemailer = await mailService.sendReport(
                    "anton.kulakoff@ya.ru",
                    renderResult.fileName
                  );
                  // console.log(sendEmail)
                  // console.log(sendEmail_nodemailer);
                  res.json({
                    message: "report sended",
                    // status: sendEmail.data.status,
                    nodemailer: sendEmail_nodemailer.response,
                  });
                }
              });
          }
          break
          // отправляем данные для рендера отчета
          // await reportService.renderReport();
        

        //получение данных из ZABBIX API и последующая запись в БД
        case "REPORT_GET_DATA":
          console.log("REPORT_GET_DATA")
          await zabbixApiService.getCountersTelemetry()
            //Ответ от API
            .then((zResponse) => {
              //вохвращаем true если все данные полкченные от API были сохранены в бд
              return zResponse && Promise.all(
                zResponse?.map(async (item) => {
                  const { serialNumber, value } = item;
                  return await countersService.saveCounterData({
                    serial_number: serialNumber,
                    value: value.toString(),
                  }).then(saveResp => {
                    //вернем статус для каждого сохраненного элемента
                    return saveResp._options.isNewRecord
                  })
                })
              )
                .then(promiseData => {
                  const checker: boolean = promiseData.every(element => element)
                  if (checker) {
                    return {
                      status: "ok", message: "zRespone saved to db"
                    }
                  } else { throw new Error("непредвиденная ошибка!") }
                })
            })
            .then(data => {
              // console.log("FINALITY DATA: ", data)
              res.json(data)
            })
            .catch(console.log)
            break


        default:
          next(ApiError.BadRequest("action fail"));

      }


    } catch (error) {
      console.log(error);
      next(ApiError.BadRequest("Непредвиденная ошибка"));
    }
  }
}

export default new ReportController();
