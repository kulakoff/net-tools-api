import UserModel from "../models/userModel";
import RolesModel from "../models/userRolesModel";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import mailApiService from "./mailApiService";
import tokenService from "./tokenService";
import { UserDto, UserTokenPayload } from "./../dtos/userDto";
import ApiError from "./../exceptions/apiError";
import { IRegistrationFormData, ITokenPayload } from "./../types/user";
import { ROLES_LIST } from "../config/rolesList";
import { JwtPayload } from "jsonwebtoken";
import redisClient from "../dbConnections/redis";
import { signJwt, verifyJwt } from "../utils/jwt/jwt";
import config from "config";

class UserService {
  async registration({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
  }: IRegistrationFormData) {
    const addUserRole = new RolesModel({ value: "user" });
    const addAdminRole = new RolesModel({ value: "admin" });
    await addUserRole.save();
    await addAdminRole.save();
    const userRole = await RolesModel.findOne({ value: "user" });

    const candidate = await UserModel.findOne({ email, phoneNumber });
    console.log(candidate);
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
    const activationLink = uuidv4();
    console.log("activationLink: ", activationLink);
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hoashPassword,
      activationLink,
      roles: [userRole.value],
    });

    //TODO:
    //
    // Сделать интеграцияю с почтовым сервисом для отправки писем с подтверждением регистрации. Яндекс и прочие сервисы банят
    //
    //отправка письма для подтверждения регистрации
    await mailApiService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/v1/activate/${activationLink}`
    );

    //генерируем пару токенов
    const userDto = new UserDto(user); //return id, email, isActivated
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async activate(activationLink: string) {
    const user = await UserModel.findOne({ activationLink: activationLink });
    console.log("activate: ", user);
    if (!user) {
      // throw new Error("Некорректная ссылка активации");
      throw ApiError.BadRequest("Некорректная ссылка активации");
    } else if (user.isActivated)
      throw ApiError.BadRequest("Некорректная ссылка активации");
    user.isActivated = true;
    user.activatedAt = new Date();
    await user.save();
  }

  async login(email: string, password: string, deviceId: string) {
    //Get user from collection
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.UnprocessableEntity(
        `Пользователь ${email} не был найден`,
        { email: `${email} не найден` }
      );
    }

    //compare imput password  and db data
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
    //modify user data
    // const userTokenPayload = new UserTokenPayload(user);

    //Token payload 
    const tokenPayload = { sub: user._id, deviceId }

    //make tokens
    const { accessToken, refreshToken } =
      await tokenService.generateTokensFeature({ ...tokenPayload });

    // await tokenService.saveToken(userDto.id, refreshToken);
    return {
      accessToken,
      refreshToken,
      deviceId,
      sub: user._id,
    };
  }

  async logout(refreshToken: string) {
    // const tokenCandidate = await tokenService.findToken(refreshToken);
    console.log("|UserService.logout | refreshToken : ", refreshToken);

    // if (tokenCandidate) {
    //   tokenCandidate.refreshToken = await tokenCandidate.refreshToken.filter(
    //     (rTokenItem) => rTokenItem !== refreshToken
    //   );
    // }

    // console.log("tokenCandidate2 : ", tokenCandidate);
    // console.log("USERID: ", tokenCandidate.user);
    // const result = await tokenService.saveToken2(
    //   tokenCandidate.user,
    //   tokenCandidate
    // );

    // const token = await tokenService.removeToken(refreshToken);
    const clearToken = await tokenService.clearToken(refreshToken);
    return clearToken; ///;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    //Проверка jwt token (jwt.verify)
    const userData: any = tokenService.validateRefreshToken(refreshToken);
    // Поиск токена в базе
    const tokenFromDb = await tokenService.findToken(refreshToken);

    //TODO
    //проверка скомпрометированных токенов
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    // Поиск пользователя в БД по данным из токена
    const user = await UserModel.findById(userData.id);
    // console.log("|UserService.logout | user : ", user);
    // Создаем payload для токена который содержит данные о пользователе (return id, email, isActivated)
    const userDto = new UserDto(user); //return id, email, isActivated
    const tokens = tokenService.generateTokens({ ...userDto });

    //TODO:
    // Сохраняем данные в базу. Заменить стрый токен на новый
    await tokenService.updateToken(
      userDto.id,
      tokens.refreshToken,
      refreshToken
    );
    return {
      ...tokens,
      user: userDto,
    };
  }

  async refreshFeature(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    //Проверка jwt token (jwt.verify)
    const userData =  verifyJwt<{ sub: string; deviceId: string, sessionId: string }>(refreshToken, "refreshTokenPublicKey")
    if (!userData ) {
      throw ApiError.Forbidden("no userData verify");
    }


    // console.log(":: DEGUG | decoded :: ", userData)
    // const userData: any = tokenService.validateRefreshToken(refreshToken);
    // Поиск токена в базе
    const existToken = redisClient.get(`${userData?.sub}:${userData?.deviceId}`);
    if (!existToken ) {
      throw ApiError.Forbidden("no existToken in redis ");
    }
    // const tokenFromDb = await tokenService.findToken(refreshToken);

    //TODO
    //проверка скомпрометированных токенов
    if (!userData || !existToken) {
      throw ApiError.UnauthorizedError();
    }

    // Поиск пользователя в БД по данным из токена
    const user = await UserModel.findById(userData.sub);
    // console.log("|UserService.logout | user : ", user);
    // Создаем payload для токена который содержит данные о пользователе (return id, email, isActivated)
    const userDto = new UserDto(user); //return id, email, isActivated
    // const tokens = tokenService.generateTokens({ ...userDto });

    const accessToken_new = signJwt({ sub: user._id, deviceId: userData.deviceId, sessionId: userData.sessionId },
      "accessTokenPrivateKey", {
      expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
    })
    const refreshToken_new = signJwt({ sub: user._id, deviceId: userData.deviceId, sessionId: userData.sessionId },
      "refreshTokenPrivateKey", {
      expiresIn: `${config.get<number>("refreshTokenExpiresIn")}m`,
    })

    await redisClient.set(`${userData.sub}:${userData.deviceId}`, refreshToken_new,
    { EX: config.get<number>("refreshTokenExpiresIn") * 60 })

    //TODO:
    // Сохраняем данные в базу. Заменить стрый токен на новый
    // await tokenService.updateToken(
    //   userDto.id,
    //   tokens.refreshToken,
    //   refreshToken
    // );

    console.log("returned data: ",{
      accessToken: accessToken_new, refreshToken: refreshToken_new,
      sub: user._id,
      deviceId: userData.deviceId
    } )
    return {
      accessToken: accessToken_new, refreshToken: refreshToken_new,
      sub: user._id,
      deviceId: userData.deviceId
    };
  }
  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }

  async getUserInfo(id: string) {
    return await UserModel.findById(id);
  }
}

export default new UserService();
