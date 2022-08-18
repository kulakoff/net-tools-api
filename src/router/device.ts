/**
 * Поиск CPE по MAC / SN (поиск по SN пока не реализован)
 * Изменить шаблон CPE
 */

import { Router } from "express";
// import authMiddleware from "../middlewares/authMiddleware";
// import userRolesVerify from "../middlewares/userRolesVerify";
import deviceController from "../controllers/devideController";
import { ROLES_LIST } from "../config/rolesList";
import { deserializeUser } from "../middlewares/deserializeUser";
import { requireUser } from "../middlewares/requireUser";
import { restrictTo } from '../middlewares/restrictTo'

export const deviceRouter = Router();

deviceRouter.use(deserializeUser, requireUser, restrictTo(ROLES_LIST.admin));
deviceRouter
  .get("/", deviceController.getDevice) //Поиск CPE по MAC / SN (поиск по SN пока не реализован)
  .post("/", deviceController.setDevice); //Изменить шаблон CPE
