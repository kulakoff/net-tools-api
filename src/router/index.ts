// const Router = require("express").Router;
import { Router } from "express";
import userController from "./../controllers/userController";
import countersController from "../controllers/countersController";
import authMiddleware from "../middlewares/authMiddleware";
import userRolesVerify from "../middlewares/userRolesVerify"
import { ROLES_LIST } from "../config/rolesList";
import reportController from "../controllers/reportController";

import { deviceRouter } from "./device"
import { authRouter } from "./auth"
import {counterRouter} from "./counters"

export const router = Router();

router.use("/auth", authRouter)
router.use("/device", deviceRouter)
router.use("/counters", counterRouter)

router.use(authMiddleware)
router.get("/users",  userRolesVerify(ROLES_LIST.admin, ROLES_LIST.superAdmin), userController.getUsers);
//Report
router.post("/main/report",  reportController.sendReport); 

//DEMO
router.post("/demo/counters/data", authMiddleware, countersController.sendMeters2); 
router.post("/demo/counters/data/id", authMiddleware, countersController.sendMetersById); 
