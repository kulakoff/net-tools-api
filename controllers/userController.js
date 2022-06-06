const userService = require("./../service/userService");
const { validationResult } = require("express-validator");
const ApiError = require("./../exceptions/apiError");

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Ошибка при валидации", errors.array())
        );
      }
      const { firstName, lastName, email, phoneNumber, password } = req.body;
      const userData = await userService.registration(
        firstName,
        lastName,
        email,
        phoneNumber,
        password
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

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      console.group("inputValues");
      console.table({ email, password });
      console.groupEnd("inputValues");
      const userData = await userService.login(email, password);

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

  async logout(req, res, next) {
    try {
      if (req.cookies.refreshToken) {
        const refreshToken = req.cookies.refreshToken;
        const token = await userService.logout(refreshToken);
        res.clearCookie("refreshToken");
        return res.json(token);
      } else {
        next(ApiError.BadRequest("Отсутствует токен"));
      }
    } catch (error) {
      next(error);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
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

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
