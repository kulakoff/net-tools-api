import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/apiError";

// const metersService = require("./../services/")
class MetersController {
  async sendMeters(req: Request, res: Response, next: NextFunction) {
    console.log(req.body)
    res.json(req.body)
  }

  async getMeters(req: Request, res: Response, next: NextFunction) { }
}

export default new MetersController();
