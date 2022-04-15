const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mailService");
const tokenService = require("./tokenService");
const UserDto = require("./../dtos/userDto");
const ApiError = require("./../exceptions/apiError");

class UserService {
  async registration(email, password, phone) {
    const candidate = await UserModel.findOne({ email, phone });
    if (candidate) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${email} уже зарегистрирован!`
      );
      // throw new Error(
      //   `Пользователь с почтовым адресом ${email} уже зарегистрирован!`
      // );
    }
    const hoashPassword = await bcrypt.hash(password, 3);
    //создаем ссылку для активации
    const activationLink = uuid.v4();
    const user = await UserModel.create({
      email,
      password: hoashPassword,
      phone,
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
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest(`Пользователь ${email} не был найден`);
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      throw ApiError.BadRequest(
        "Некорректные данные для авторизации, проверьте email и pass"
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
    console.log("userService.logout: ", refreshToken);
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    console.log("User service. refresh");
    if (!refreshToken) {
      console.log("User service. no refreshToken");
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    console.log("|DEBUG| userData: ", userData);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    console.log("|DEBUG| tokenFromDb: ", tokenFromDb);
    if (!userData || !tokenFromDb) {
      console.log("User service, not tokenFromDb");
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
