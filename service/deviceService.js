const { DeviceModel } = require("../models/cpeModel");
const ApiError = require("./../exceptions/apiError");

class DeviceService {
  async getDevice(device) {
    // const device = await DeviceModel.findOne()

    try {
      return { cpe: "params" };
    } catch (error) {
      return ApiError.BadRequest();
    }
  }
}

module.exports = new DeviceService();
