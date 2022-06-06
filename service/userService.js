const { UserModel } = require("../models/userModel");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mailService");
const tokenService = require("./tokenService");
const UserDto = require("./../dtos/userDto");
const ApiError = require("./../exceptions/apiError");

class UserService {
  async registration(firstName, lastName, email, phoneNumber, password) {
    const candidate = await UserModel.findOne({ email, phoneNumber });
    if (candidate) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${email} уже зарегистрирован!`
      );
      // throw new Error(
      //   `Пользователь с почтовым адресом ${email} уже зарегистрирован!`
      // );
    }
    const hoashPassword = await bcrypt.hash(password, 10);
    //создаем ссылку для активации
    const activationLink = uuid.v4();
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hoashPassword,
      activationLink,
    });
    //отправка письма для подтверждения регистрации
    // await mailService.sendActivationMail(
    //   email,
    //   `${process.env.API_URL}/api/v1/activate/${activationLink}`
    // );

    //генерируем пару токенов
    const userDto = new UserDto(user); //return id, email, isActivated
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink: activationLink });
    if (!user) {
      // throw new Error("Некорректная ссылка активации");
      throw ApiError.BadRequest("Некорректная ссылка активации");
    } else if (user.isActivated)
      throw ApiError.BadRequest("Некорректная ссылка активации");
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.UnprocessableEntity(
        `Пользователь ${email} не был найден`,
        { email: "email не найден" }
      );
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      throw ApiError.UnprocessableEntity(
        "Некорректные данные для авторизации, проверьте email или pass",
        {
          email: "Проверьте правильность ввода email",
          password: "Проверьте правильность ввода passwd",
        }
      );
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user); //return id, email, isActivated
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }
}
module.exports = new UserService();
