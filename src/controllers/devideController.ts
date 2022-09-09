import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/apiError";
import deviceService from "../service/deviceService";

class DeviceController {
  async getDevice(req: Request, res: Response, next: NextFunction) {
    try {
      if (
        req.query.type === "serialNumber" ||
        req.query.type === "macAddress"
      ) {
        const { type, value } = req.query;
        switch (type) {
          case "serialNumber":
            const deviceDataBySN = await deviceService.getDeviceBySN(value);
            return res.json(deviceDataBySN);
          case "macAddress":
            const deviceDataByMAC = await deviceService.getDeviceByMAC(value);
            if (deviceDataByMAC !== null) {
              return res.json(deviceDataByMAC);
            } else {
              next(
                ApiError.NotFound(
                  `Устройство не найдено, проверьте корректность введенных данных`
                )
              );
            }
        }
        // const device = await deviceService.getDevice(req.query)
      } else {
        next(ApiError.BadRequest(`Проверьте корректность запроса`));
      }
    } catch (error) {
      next(ApiError.BadRequest("Не верный запрос2"));
    }
  }

  async setDevice(req: Request, res: Response, next: NextFunction) {
    //TODO: сделать POST запрос genieacs api, задача сброс настроек
    try {
      //TODO: переделать проверку body
      if (Object.keys(req.body).length === 3) {
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
export default new DeviceController();
