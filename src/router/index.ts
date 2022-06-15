// const Router = require("express").Router;
import { Router } from "express"
import { body } from "express-validator"
export const router = Router();
// const { body } = require("express-validator");

// const userController = require("./../controllers/userController");
// const authMiddleware = require("../middlewares/authMiddleware");

import userController from "./../controllers/userController"
const deviceController = require("./../controllers/devideController");
const metersController = require("./../controllers/metersController");
import authMiddleware from "../middlewares/authMiddleware";


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
router.get("/meters", authMiddleware, metersController.getMeters);
router.post("/meters", authMiddleware, metersController.sendMeters);

// module.exports = { router };

