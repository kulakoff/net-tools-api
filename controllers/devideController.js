const ApiError = require("./../exceptions/apiError");

class DeviceController {
  async getDevice(req, res, next) {
    try {
      console.log("device get", req.query);
      console.table(req.query);
      // const device = await deviceService.getDevice(req.body)
      res.json({ method: "get" });
    } catch (error) {
      next(error);
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
