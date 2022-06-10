const ApiError = require("./../exceptions/apiError");
// const metersService = require("./../services/")
class MetersController {
  async sendMeters(req, res, next) {
      console.log(req.body)
      res.json(req.body)
  }

  async getMeters(req, res, next) {}
}

module.exports = new MetersController();
