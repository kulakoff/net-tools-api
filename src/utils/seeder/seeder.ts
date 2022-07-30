import cron from "node-cron";
import zabbixApiService from "../../service/zabbixApiService";
import CountersService from "../../service/countersService";
import { appConfig } from "../../config";
import axios from "axios";

import telegramSender from "../telegram/telegramSender";

const { token, chatId  } = appConfig.telegran;

const apiToDb = async () => {
  await zabbixApiService
    .getCountersTelemetry()
    //Ответ от API
    .then((zResponse) => {
      //вохвращаем true если все данные полкченные от API были сохранены в бд
      return (
        zResponse &&
        Promise.all(
          zResponse?.map(async (item) => {
            const { serialNumber, value } = item;
            return await CountersService.saveCounterData({
              serial_number: serialNumber,
              value: value.toString(),
            }).then((saveResp) => {
              //вернем статус для каждого сохраненного элемента
              return saveResp._options.isNewRecord;
            });
          })
        ).then((promiseData) => {
          const checker: boolean = promiseData.every((element) => element);
          if (checker) {
            return {
              status: "ok",
              message: "zRespone saved to db",
            };
          } else {
            throw new Error("непредвиденная ошибка!");
          }
        })
      );
    })
    .then((data) => {
      console.log(data);
    })
    .catch(console.log);
};

/**
 * Планировщик, опрос API в отчетный период 25 числа кажого месяца и сохранение данные в БД
 */
const seeder = cron.schedule(
  "15 4 25 * *", //Старт кажое 25 число месяца в 04:15
  () => {
    console.log("Запуск задачи: ", new Date().toLocaleString("RU"));
    apiToDb().finally(async () => {
      await telegramSender({
        token: token,
        chat_id: chatId,
        text: "Данные телеметрии сохранены в БД. Внесите показания приборов учета не оснащеных телемтрией и выполните отправку отчета в сбытовую компанию",
      });
    });
  },
  { scheduled: false, timezone: "Europe/Moscow" }
);

export default seeder;
