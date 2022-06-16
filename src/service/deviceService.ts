import CpeModel from "../models/cpeModel";
import ApiError from "../exceptions/apiError";

class DeviceService {
  async getDeviceBySN(value: string) {
    try {
      const deviceData = await CpeModel.findOne({
        "_deviceInfo.serialNumber": value,
      });
      return deviceData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getDeviceByMAC(value: string) {
    try {
      const deviceData = await CpeModel.findOne({
        "_deviceInfo.macAddress": value,
      });
      if (deviceData !== null) {
        return deviceData;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return ApiError.BadRequest("Непредвиденная ошибка");
    }
  }

  async setDevice(data: any) {
    try {
      const moment = new Date();
      const { serialNumber, macAddress, configMode } = data;
      const filter = {
        "_deviceInfo.serialNumber": serialNumber,
        "_deviceInfo.macAddress": macAddress,
      };
      const update = {
        $set: {
          configMode: {
            _value: configMode,
            _timestamp: moment,
          },
          "wifi.ssid2": {
            _value: `LanTa-${macAddress
              .substr(macAddress.length - 5)
              .replace(/:/g, "")}`,
            _timestamp: moment,
          },

          "wifi.ssid5": {
            _value: `LanTa-${macAddress
              .substr(macAddress.length - 5)
              .replace(/:/g, "")}-5GHz`,
            _timestamp: moment,
          },
        },
      };
      const updateDevice = await CpeModel.findOneAndUpdate(filter, update, {
        returnDocument: "after",
      });
      return updateDevice;
    } catch (error) {
      console.log(error);
      return ApiError.BadRequest("Не возможно изменить параметры");
    }
  }
}

export default new DeviceService();
