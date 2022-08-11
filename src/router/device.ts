import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import userRolesVerify from "../middlewares/userRolesVerify";
import deviceController from "../controllers/devideController";
import { ROLES_LIST } from "../config/rolesList";
import { deserializeUser } from "../middlewares/deserializeUser";
import { requireUser } from "../middlewares/requireUser";
import { restrictTo } from '../middlewares/restrictTo'

export const deviceRouter = Router();
console.log("deviceRouter")

deviceRouter.use(deserializeUser, requireUser, restrictTo('admin'));
// deviceRouter.use(authMiddleware, userRolesVerify(ROLES_LIST.admin));
deviceRouter
  .get("/", deviceController.getDevice) //Поиск CPE по MAC / SN
  .post("/", deviceController.setDevice); //Изменить шаблон CPE
