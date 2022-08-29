require("dotenv").config();
import config from "config";
import { v4 as uuidv4 } from "uuid";

import userService from "../service/userService";
import { validationResult } from "express-validator";
import { Request, Response, NextFunction, CookieOptions } from "express";
import ApiError from "./../exceptions/apiError";
import { UserInfoDto } from "../dtos/userDto";
import { LoginUserInput } from "../schema/user.schema";
import { appConfig } from "../config";
import redisClient from "../dbConnections/redis";

// Exclude this fields from the response
export const excludedFields = ["password"];

//set minimal age for not used cookie data
const setCookie = (res: Response) => {
  res.cookie("accessToken", "", { maxAge: 1 });
  res.cookie("refreshToken", "", { maxAge: 1 });
};

const clientUrl: string = process.env.CLIENT_URL || "http://192.168.13.20:3000"; // редирект после активации на этот урл

const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() + config.get<number>("accessTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("accessTokenExpiresIn") * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

const refreshTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() + config.get<number>("refreshTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("refreshTokenExpiresIn") * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

const deviceIdCookieOptions: CookieOptions = {
  expires: new Date(
    new Date().setDate(
      new Date().getDate() + config.get<number>("deviceIdExpiresIn")
    )
  ),
  // maxAge: config.get<number>("deviceIdExpiresIn"),
  httpOnly: true,
  sameSite: "lax",
};

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
      let { deviceId }: { deviceId: string } = req.cookies;
      if (!deviceId) deviceId = uuidv4();
      
      const { accessToken, refreshToken, sub } = await userService.registration(
        {
          form: { firstName, lastName, email, phoneNumber, password },
          deviceId,
        }
      );

      // Отдаем cookie клиенту
      res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
      res.cookie("accessToken", accessToken, accessTokenCookieOptions);
      res.cookie("deviceId", deviceId, deviceIdCookieOptions);
      res.json({
        deviceId,
        sub,
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(
    req: Request<{}, {}, LoginUserInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password } = req.body;
      let { deviceId }: { deviceId: string } = req.cookies;

      if (!deviceId) {
        deviceId = uuidv4();
      }

      const userData = await userService.login(email, password, deviceId);

      // Отдаем cookie клиенту
      res.cookie(
        "refreshToken",
        userData.refreshToken,
        refreshTokenCookieOptions
      );
      res.cookie("accessToken", userData.accessToken, accessTokenCookieOptions);
      res.cookie("deviceId", userData.deviceId, deviceIdCookieOptions);

      res.json({
        deviceId,
        sub: userData.sub,
        accessToken: userData.accessToken,
      });
    } catch (error) {
      console.log("login error: ", error);
      next(error);
    }
  }

  async logout_pre(req: Request, res: Response, next: NextFunction) {
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

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, deviceId } = res.locals;
      const { refreshToken } = req.cookies;
      await redisClient.del(`${user._id}:${deviceId}`);
      if (refreshToken) {
        // Is refreshToken in db?
        const token = await userService.logout(refreshToken);
        //Обновляем время жизни cookie на стороне клиента
        setCookie(res);
        res.status(200).json({ status: "success" });
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
      // Get the refresh token from cookie
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

  async refreshFeature(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the refresh token from cookie
      const {
        refreshToken,
        deviceId,
      }: { refreshToken: string; deviceId: string } = req.cookies;

      const userData = await userService.refreshFeature(refreshToken);

      // Отдаем cookie клиенту
      res.cookie(
        "refreshToken",
        userData.refreshToken,
        refreshTokenCookieOptions
      );
      res.cookie("accessToken", userData.accessToken, accessTokenCookieOptions);
      res.cookie("deviceId", userData.deviceId, deviceIdCookieOptions);

      res.json({
        deviceId,
        sub: userData.sub,
        accessToken: userData.accessToken,
      });
    } catch (error) {
      console.log(error);
      //TODO:
      //переделать очистку refreshToken из cookie
      // res.clearCookie("refreshToken");
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
      const { id } = req.body.user;
      let userInfo = await userService.getUserInfo(id);
      const userInfoDto = new UserInfoDto(userInfo); //return id, email, isActivated
      console.log(userInfoDto);
      return res.json(userInfoDto);
    } catch (error) { }
  }

  async userInformationFeature(req: Request, res: Response, next: NextFunction) {
    try {
      //Получаем 
      const { user } = res.locals;
      return res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });

    } catch (error) { }
  }


}
export default new UserController();
