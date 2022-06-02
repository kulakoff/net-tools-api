const { CpeModel } = require("../models/cpeModel");
const ApiError = require("./../exceptions/apiError");

class DeviceService {
  async getDeviceBySN(value) {
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

  async getDeviceByMAC(value) {
    try {
      const deviceData = await CpeModel.findOne({
        "_deviceInfo.macAddress": value,
      });
      return deviceData;
    } catch (error) {
      console.log(error);
      return ApiError.BadRequest();
    }
  }

  async setDevice(data) {
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

module.exports = new DeviceService();
