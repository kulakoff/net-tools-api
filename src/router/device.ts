import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import userRolesVerify from "../middlewares/userRolesVerify";
import deviceController from "../controllers/devideController";
import { ROLES_LIST } from "../config/rolesList";
export const deviceRouter = Router();

deviceRouter.use(authMiddleware, userRolesVerify(ROLES_LIST.admin));
deviceRouter
  .get("/", deviceController.getDevice) //Поиск CPE по MAC / SN
  .post("/", deviceController.setDevice); //Изменить шаблон CPE
