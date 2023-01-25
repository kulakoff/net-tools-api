import { IResponseCounterItem } from "../types/zabbixApiREsponse";

require("dotenv").config();
const ZabbixAPI = require("zabbix-rpc");

const ZABBIX_CONNECTION = {
  host: process.env.ZABBIX_HOST,
  user: process.env.ZABBIX_USERNAME,
  password: process.env.ZABBIX_PASSWORD,
};

//Имя группы для поиска
const zbxFilterName = {
  output: "extend",
  filter: { name: "ERD" },
  limit: 15,
};

class ZabbixApiService {
  async getCountersTelemetry(
    requestTimestamp: number = new Date().setTime(
      new Date().getTime() - 30 * 60 * 1000
    )
  ) {
    try {
      //Human data to unixtime
      const reqMoment = new Date(requestTimestamp).getTime() / 1000;

      //Прибавляем 30 мин к указанной дате
      const reqMoment30 =
        new Date(requestTimestamp).setTime(
          new Date(requestTimestamp).getTime() + 30 * 60 * 1000
        ) / 1000;

      const z = new ZabbixAPI(ZABBIX_CONNECTION.host);

      //Получаем массив с показниями приборов учета.
      //будут опрошены только те у уого заполнены поля selectInventory
      const data: IResponseCounterItem[] = await z.user
        .login(ZABBIX_CONNECTION.user, ZABBIX_CONNECTION.password)
        .then((data: any) => {
          // console.log("::DEBUG| ", data);
          return data;
        })
        //Получаем groupId по фильтру
        .then(
          async () =>
            await z.host.group.get(zbxFilterName).then((result: any) => {
              // console.log("Host Group >>> ", JSON.stringify(result));
              return result[0].groupid;
            })
        )
        //G Получаем список хостов по groupId
        .then(async (groupId: number) => {
          const PARAMS_GET_BY_GROUP = {
            groupids: groupId,
            output: ["hostid", "host"],
            selectInventory: [
              "serialno_a",
              "software_app_a",
              "model",
              "location",
            ],
            // searchInventory: {  //не работает в старом заббикс searchInventory
            //     software_app_a: 'reportRender'
            // },
            withInventory: 4,
            sortfield: "hostid",
          };
          return await z.host.get(PARAMS_GET_BY_GROUP).then((data: any) => {
            // console.log("Hosts >> :", JSON.stringify(data));
            return data;
          });
        })

        .then(async (hosts: any) => {
          return await Promise.all(
            //модифицировать массив getHosts добавив него показания счетчиков за указанный период...
            await hosts.map(async (mapData: any) => {
              // let container = new Array();

              //получение itemId запрашиваемоо элемента
              let itemId = await z.item
                .get({
                  hostids: mapData.hostid,
                  output: ["hostid", "itemid", "name"],
                  filter: { name: "En T" },
                  limit: 1,
                })
                .then((res: any) => {
                  console.log("::DEBUG|itemId", res);
                  return res[0].itemid;
                });

              console.log("::DEBUG|-itemId-| ", itemId);

              //получение значений элемента в заданный период времени
              let getItemValues = await z.history
                .get({
                  output: "extend",
                  history: 0,
                  itemids: itemId,
                  time_from: reqMoment,
                  time_till: reqMoment30,
                  sortfield: "clock",
                  limit: 1,
                })
                .then((res: any) => {
                  console.log("::DEBUG|getItemValues| ", res);
                  return res[0];
                });

              // console.log("getItemValues: >>>", getItemValues);

              //TODO переделать!
              //формируем итоговый объект
              let container = {
                location: mapData.inventory.location,
                modelName: mapData.inventory.model,
                serialNumber: mapData.inventory.serialno_a,
                value: Math.trunc(getItemValues.value),
                timestamp: getItemValues.clock * 1000,
              };

              return container;
            })
          )
            .then((data) => data)
            .catch((error) => console.log(error));
        });

      // if (data!==null) { return data }
      // else return null
      await z.user.logout();
      // console.log("zabbix api data >>> : ", data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new ZabbixApiService();
