require("dotenv").config();
import userService from "../service/userService";
import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import ApiError from "./../exceptions/apiError";
import { UserInfoDto } from "../dtos/userDto";
let clientUrl: string = process.env.CLIENT_URL || "http://192.168.13.20:3000" // редирект после активации на этот урл


class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Ошибка при валидации", errors.array())
        );
      }
      const { firstName, lastName, email, phoneNumber, password } = req.body;
      const userData = await userService.registration(
        {
          firstName,
          lastName,
          email,
          phoneNumber,
          password
        }
      );
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 7 * 24 * 60 * 1000, //7 day
        httpOnly: true,
      });
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      console.table({ email, password });
      const userData = await userService.login(email, password);
      // console.log("UserController-login.userData: ",userData)

      //генерирует токен
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 7 * 24 * 60 * 1000, //7 day
        httpOnly: true,
      });
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      console.log("req.cookies.refreshToken: ", refreshToken);
      if (refreshToken) {
        // const refreshToken = req.cookies.refreshToken;

        // Is refreshToken in db?
        const token = await userService.logout(refreshToken);
        res.clearCookie("refreshToken");
        return res.sendStatus(204);
        // return res.json(token); ///???? переделать ответ
      } else {
        next(ApiError.BadRequest("Token not found"));
      }
    } catch (error) {
      next(error);
    }
  }

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(clientUrl);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("REFRESH_ENDPOINT")
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      //генерирует токен
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 7 * 24 * 60 * 1000, //7 day
        httpOnly: true,
      });
      res.json(userData);
    } catch (error) {
      //TODO:
      //переделать очистку refreshToken из cookie
      res.clearCookie("refreshToken");
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async userInformation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body.user
      let userInfo = await userService.getUserInfo(id)
      const userInfoDto = new UserInfoDto(userInfo); //return id, email, isActivated
      console.log(userInfoDto)
      return res.json(userInfoDto)
    } catch (error) {

    }
  }
}
export default new UserController();


