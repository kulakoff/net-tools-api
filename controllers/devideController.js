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
            return (res.json(deviceDataBySN));
          case "macAddress":
            const deviceDataByMAC = await deviceService.getDeviceByMAC(value);
            return (res.json(deviceDataByMAC));
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
    try {
      console.log("device post");
      res.json({ method: "post" });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new DeviceController();
