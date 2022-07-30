// const Router = require("express").Router;
import { Router, Request, Response, NextFunction } from "express";
import userController from "./../controllers/userController";
import countersController from "../controllers/countersController";
import authMiddleware from "../middlewares/authMiddleware";
import userRolesVerify from "../middlewares/userRolesVerify";
import { ROLES_LIST } from "../config/rolesList";
import reportController from "../controllers/reportController";

import { deviceRouter } from "./device";
import { authRouter } from "./auth";
import { counterRouter } from "./counters";

export const router = Router();

//Routes

//Auth service 
router.use("/auth", authRouter);

//Manage CPE service
router.use("/device", deviceRouter);

//Manage Counters and render report to provider
router.use("/counters", counterRouter);

router.use(authMiddleware);

router.get(
  "/users",
  userRolesVerify(ROLES_LIST.admin, ROLES_LIST.superAdmin),
  userController.getUsers
);

//Report
router.post("/main/report", reportController.sendReport);

//DEMO & Testing
router.get("/health", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: "success",
    message: "Service is working 🚀",
  });
});

router.post(
  "/demo/counters/data",
  authMiddleware,
  countersController.sendMeters2
);

router.post(
  "/demo/counters/data/id",
  authMiddleware,
  countersController.sendMetersById
);
