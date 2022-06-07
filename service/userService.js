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

    //TODO:
    //
    // Сделать интеграцияю с почтовым сервисом для отправки писем с подтверждением регистрации. Яндекс и прочие сервисы банят
    //
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
        { email: `&${email} не найден` }
      );
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      throw ApiError.UnprocessableEntity(
        "Некорректные данные для авторизации, проверьте email или passwd",
        {
          email: "Проверьте правильность ввода email",
          password: "Проверьте правильность ввода passwd",
        }
      );
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    console.log("| UserService | login | token | ");
    console.log(tokens);
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    const tokenCandidate = await tokenService.findToken(refreshToken);
    console.log("tokenCandidate: ", tokenCandidate);
    if (tokenCandidate) {
      tokenCandidate.refreshToken = tokenCandidate.refreshToken.filter(
        (rTokenItem) => {
          rTokenItem !== refreshToken;
        }
      );
    }
    const result = await tokenService.saveToken(tokenCandidate);

    // const token = await tokenService.removeToken(refreshToken);
    return result;
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
