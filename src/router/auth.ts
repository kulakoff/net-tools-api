import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { body } from "express-validator";
import userController from "../controllers/userController";
import {validateMiddleware as validate} from "../middlewares/validateMiddleware"
import {loginUserSchema} from "../schema/user.schema"

export const authRouter = Router();
authRouter
    .post(
        "/registration",
        body("email").isEmail(),
        body("password").isLength({ min: 3, max: 20 }),
        userController.registration)
    .post("/login", validate(loginUserSchema), userController.login)
    .post("/logout", userController.logout)
    .get("/activate/:link", userController.activate)
    .get("/refresh", userController.refreshFeature)
    .get("/me", authMiddleware, userController.userInformation)

