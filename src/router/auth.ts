import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { body } from "express-validator";
import userController from "../controllers/userController";
import { validateMiddleware as validate } from "../middlewares/validateMiddleware";
import { deserializeUser } from "../middlewares/deserializeUser";
import { requireUser } from "../middlewares/requireUser";
import { loginUserSchema } from "../schema/user.schema";

export const authRouter = Router();
authRouter
  .post(
    "/registration",
    body("email").isEmail(),
    body("password").isLength({ min: 3, max: 20 }),
    userController.registration
  )
  .post("/login", validate(loginUserSchema), userController.login)
  .get("/activate/:link", userController.activate)
  .get("/refresh", userController.refreshFeature)

//Доступно только авторизованным пользователям

authRouter
  .use(deserializeUser, requireUser)
  .get("/me", userController.userInformationFeature)
  .get("/logout", userController.logout)
