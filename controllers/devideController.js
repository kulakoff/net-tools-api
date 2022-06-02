const ApiError = require("./../exceptions/apiError");
const deviceService = require("../service/deviceService");

class DeviceController {
  async getDevice(req, res, next) {
    try {
      if (
        (req.query.cpe && req.query.cpe.type === "serialNumber") ||
        req.query.cpe.type === "macAddress"
      ) {
        const { type, value } = req.query.cpe;
        switch (type) {
          case "serialNumber":
            console.log("case serialNumber");
            const deviceDataBySN = await deviceService.getDeviceBySN(value);
            return res.json(deviceDataBySN);
          case "macAddress":
            const deviceDataByMAC = await deviceService.getDeviceByMAC(value);
            return res.json(deviceDataByMAC);
        }
        // const device = await deviceService.getDevice(req.query)
      } else {
        next(ApiError.BadRequest(`Проверьте корректность запроса`));
      }
    } catch (error) {
      next(ApiError.BadRequest("Не верный запрос2"));
    }
  }

  async setDevice(req, res, next) {
    //TODO: сделать POST запрос genieacs api, задача сброс настроек
    try {
      console.log("POST data: ", req.body);
      //TODO: переделать проверку body
      if (Object.keys(req.body).length === 3) {
        console.log("REQ keys: 3");
        const updatedDevice = await deviceService.setDevice(req.body);
        return res.json(updatedDevice);
      }
      next(ApiError.BadRequest("Не верное тело запроса"));
    } catch (error) {
      next(error);
    }
  }

  // async setDevice(req, res, next) {
  //   try {
  //     console.log("device post");
  //     if (
  //       (req.query.cpe && req.query.cpe.type === "serialNumber") ||
  //       req.query.cpe.type === "macAddress"
  //     ){
  //       const { type, value } = req.query.cpe;
  //       const deviceDataBySN = await deviceService.getDeviceBySN(value);
  //           return res.json(deviceDataBySN);

  //     }
  //       res.json({ method: "post" });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}
module.exports = new DeviceController();
