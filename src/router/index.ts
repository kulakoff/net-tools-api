// const Router = require("express").Router;
import { Router, Request, Response, NextFunction } from "express";
import userController from "./../controllers/userController";
// import countersController from "../controllers/countersController";
// import authMiddleware from "../middlewares/authMiddleware";
import userRolesVerify from "../middlewares/userRolesVerify";
import { ROLES_LIST } from "../config/rolesList";
import reportController from "../controllers/reportController";

import { deviceRouter } from "./device";
import { authRouter } from "./auth";
import { counterRouter } from "./counters";
import { deserializeUser } from "../middlewares/deserializeUser";
import { requireUser } from "../middlewares/requireUser";
// import { restrictTo } from "../middlewares/restrictTo";

export const router = Router();

//Routes

//Auth service 
router.use("/auth", authRouter);

//Manage CPE service
router.use("/device", deviceRouter);

//Manage Counters and render report to provider
router.use("/counters", counterRouter);

//DEMO & Testing
router.get("/health", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: "success",
    message: "Service is working 🚀",
  });
});



router.use(deserializeUser);
router.use(requireUser);

router.get(
  "/users",
  deserializeUser,requireUser,
  // restrictTo(ROLES_LIST.admin),
  userRolesVerify(ROLES_LIST.admin),
  userController.getUsers
);

//Report
router.post("/report",  reportController.sendReport);


