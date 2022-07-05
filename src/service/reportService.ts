import fs from "fs";
import { IDataForReport } from "../types/counters";
const carbone = require("carbone");

class ReportService {
  async renderReport(props: IDataForReport) {
    console.log("ReportService, start renderReport >>>");
    // console.log(props);
    const reportName = `report_${new Date().toLocaleDateString("RU")}.ods`; // report_04.07.2022.ods

    await carbone.render(
      "./src/templates/TEMPLATE4RENDER.ods",
      props,
      (err: any, result: any) => {
        if (err) return console.log(err);
        console.log("carbone generate file: " + reportName);
        if (result) {
          fs.writeFileSync(`./reports/${reportName}`, result);
        }
      }
    );
    return { message: "render success", fileName: reportName };
  }
}

export default new ReportService();
