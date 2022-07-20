// const Router = require("express").Router;
import { Router } from "express";
import { body } from "express-validator";

import userController from "./../controllers/userController";
import deviceController from "./../controllers/devideController";
import countersController from "../controllers/countersController";
import authMiddleware from "../middlewares/authMiddleware";

import userRolesVerify from "../middlewares/userRolesVerify"
import { ROLES_LIST } from "../config/rolesList";

import reportController from "../controllers/reportController";

export const router = Router();

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 20 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get("/me",authMiddleware, userController.userInformation)
//TODO: сделать роут "/me" для получания даннх о пользователе на основании его токена

router.get("/users", authMiddleware, userRolesVerify(ROLES_LIST.Admin, ROLES_LIST.SuperAdmin), userController.getUsers);
/**
 * Поиск CPE по MAC / SN
 */
router.use(authMiddleware,userRolesVerify(ROLES_LIST.Editor))
router.get("/device", authMiddleware, deviceController.getDevice);
/**
 * Изменить шаблон CPE
 */
router.post("/device", authMiddleware, deviceController.setDevice);

//TODO: сделать вложенные роут объеденив по группам endpoints
router.get("/counters", authMiddleware, countersController.getItems); //+
router.patch("/counters/:id", authMiddleware, countersController.setItem);
router.get("/counters/:id", authMiddleware, countersController.getItem); //+
router.post("/counters/new", authMiddleware, countersController.newItem); //+
router.delete("/counters", authMiddleware, countersController.removeItem); //+
// router.post("/counters", authMiddleware, countersController.sendCountersData); //+
/**
 *Отправка показаний приборов учета
 */
router.post("/counters/data", authMiddleware, countersController.sendMeters); //+
//Просмотр показаний по выбранного прибора учета
router.get(
  "/counters/:id/data",
  authMiddleware,
  countersController.getItemData
); //+

//Вывод истории показаний прибора учета
router.get(
  "/counters/:id/history",
  authMiddleware,
  countersController.getItemDataHistory
); //+

//Report
router.post("/main/report", authMiddleware, reportController.sendReport); //+




//DEMO
router.post("/demo/counters/data", authMiddleware, countersController.sendMeters2); //+
router.post("/demo/counters/data/id", authMiddleware, countersController.sendMetersById); //+
