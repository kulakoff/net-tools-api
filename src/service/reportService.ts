import fs from "fs";
import { IDataForReport } from "../types/counters";
const carbone = require("carbone");

class ReportService {
  async renderReport(props: IDataForReport) {
    console.log("ReportService, start renderReport >>>");
    // console.log(props);
    const reportName = `report_${new Date().toLocaleDateString("RU")}.pdf`; // report_04.07.2022.ods
    const options = {
      convertTo    : 'pdf'
    };

    return new Promise(async (resolve, reject) => {
      await carbone.render(
        "./src/templates/TEMPLATE4RENDER.ods",
        props,
        options,
        async (err: any, result: any) => {
          if (err) return console.log(err);
          console.log("carbone generate file: " + reportName);
          if (result) {
            fs.writeFileSync(`./reports/${reportName}`, result);
            resolve({ message: "render success", fileName: reportName })
          }

        }


      )
    })

    //  await carbone.render(
    //   "./src/templates/TEMPLATE4RENDER.ods",
    //   props,
    //   async (err: any, result: any) => {
    //     if (err) return console.log(err);
    //     console.log("carbone generate file: " + reportName);
    //     if (result) {
    //       fs.writeFileSync(`./reports/${reportName}`, result);
    //     }
    //   }


    //   ).then((renderResult:any) => {console.log("renderResult",renderResult)})

    return { message: "render success", fileName: reportName };
  }
}

export default new ReportService();
