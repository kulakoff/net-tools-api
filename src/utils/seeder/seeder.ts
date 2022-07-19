require("dotenv").config();
import cron from "node-cron";
import zabbixApiService from "../../service/zabbixApiService";
import CountersService from "../../service/countersService";
import axios from "axios";

import telegramSender from "../telegram/telegramSender";
const TELEGRAM_TOKEN: string = process.env.TELEGRAM_TOKEN || "example_token";
const TELEGRAM_CHAT_ID: string =
  process.env.TELEGRAM_CHAT_ID || "example_chat_id";

const apiToDb = async () => {
  console.log("get data from Zabbix API & save to DB");
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
      // console.log("FINALITY DATA: ", data)
      console.log(data);
    })
    .catch(console.log);
};

const seeder = cron.schedule(
  // "40 12 19 * *", //Старт кажое 25 число месяца в 04:15
  "15 4 25 * *", //Старт кажое 25 число месяца в 04:15
  () => {
    console.log(
      "Запуск задачи: ",
      new Date().toLocaleString("RU")
    );
    apiToDb().finally(async () => {
      await telegramSender({
        token: TELEGRAM_TOKEN,
        chat_id: TELEGRAM_CHAT_ID,
        text: "Данные телеметрии сохранены в БД. Внесите данные приборов учета без телеметрии и выполните отправку отчета",
      });
    });
  },
  { scheduled: false, timezone: "Europe/Moscow" }
);

export default seeder;
