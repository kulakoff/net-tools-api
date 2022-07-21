import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { body } from "express-validator";
import userController from "../controllers/userController";

export const authRouter = Router();
authRouter
    .post(
        "/registration",
        body("email").isEmail(),
        body("password").isLength({ min: 3, max: 20 }),
        userController.registration)
    .post("/login", userController.login)
    .post("/logout", userController.logout)
    .get("/activate/:link", userController.activate)
    .get("/refresh", userController.refresh)
    .get("/me", authMiddleware, userController.userInformation)

