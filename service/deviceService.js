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
}

module.exports = new DeviceService();
