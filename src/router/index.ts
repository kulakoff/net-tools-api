// const Router = require("express").Router;
import { Router } from "express";
import { body } from "express-validator";

import userController from "./../controllers/userController";
import deviceController from "./../controllers/devideController";
import countersController from "../controllers/countersController";
import authMiddleware from "../middlewares/authMiddleware";

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

router.get("/users", authMiddleware, userController.getUsers);

router.get("/device", authMiddleware, deviceController.getDevice);
router.post("/device", authMiddleware, deviceController.setDevice);

router.get("/counters", authMiddleware, countersController.getItems);//+
router.patch("/counters/:id", authMiddleware, countersController.setItem);
router.get("/counters/:id", authMiddleware, countersController.getItem);//+
router.post("/counters/new", authMiddleware, countersController.newItem);//+
router.delete("/counters", authMiddleware, countersController.removeItem);//+
router.post("/counters", authMiddleware, countersController.sendCountersData);
