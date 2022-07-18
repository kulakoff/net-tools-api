import { sign, verify } from "jsonwebtoken";
import TokenModel from "../models/tokenModel";

class TokenService {
  generateTokens(payload: any) {
    const accessToken = sign(payload, process.env.JWT_ACCESS_SECRET || "secret1", {
      expiresIn: process.env.JWT_ACCESS_EXPIRESIN || "15m",
    });
    const refreshToken = sign(payload, process.env.JWT_REFRESH_SECRET || "secret2", {
      expiresIn: process.env.JWT_REFRESH_EXPIRESIN || "7d",
    });
    return { accessToken, refreshToken };
  }

  valdateAccessToken(token: string) {
    try {
      const userData = verify(token, process.env.JWT_ACCESS_SECRET || "secret3");
      return userData;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = verify(token, process.env.JWT_REFRESH_SECRET || "secret3");
      // console.log("validateRefreshToken userData:", userData);
      return userData;
    } catch (error) {
      return null;
    }
  }

  async saveToken(userId: any, refreshToken: string) {
    //поиск документа
    // const data  = await TokenModel.
    const existToken = await TokenModel.findOne({ user: userId });
    // console.log("TokenService.saveToken:tokenData: ", existToken);
    if (existToken) {
      console.log("|saveToken| document exist, addded new token ...  ");

      // existToken.refreshToken = await existToken.refreshToken.filter(
      //   (rt) => rt !== refreshToken
      // ); ///

      existToken.refreshToken = [...existToken.refreshToken, refreshToken];
      console.log("existToken.refreshToken new: ", existToken.refreshToken);
      return await existToken.save();
    }
    //если документ отсутствует - создаем  документ содержащий  refreshToken
    console.log(
      "|saveToken| document net found , addded new document with token ...  "
    );
    const token = await TokenModel.create({ user: userId, refreshToken });
    return token;
  }

  // service update fefresh token
  async updateToken(userId: any, newRefreshToken: string, oldRefreshToken: string) {
    const tokenData = await TokenModel.findOne({ user: userId });
    if (tokenData) {
      const filteredToken = await tokenData.refreshToken.filter(
        (rt:any) => rt !== oldRefreshToken
      );
      // console.log("| updateToken | filteredToken: ",filteredToken)
      tokenData.refreshToken = [...filteredToken, newRefreshToken];
      // console.log("| updateToken | tokenData: ", tokenData);
      return tokenData.save();
    }
  }

  async clearToken(refreshToken: string) {
    const tokenData = await TokenModel.findOne({ refreshToken });
    console.log("TokenService.clearToken | tokenData: ", tokenData);
    // console.log("newRefreshToken: ", newRefreshToken);
    if (tokenData) {
      tokenData.refreshToken = await tokenData.refreshToken.filter(
        (rt:any) => rt !== refreshToken
      ); ///
      return await tokenData.save();
    }
  }

  async removeToken(refreshToken:string) {
    const tokenData = await TokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken:string) {
    const tokenData = await TokenModel.findOne({ refreshToken }).exec();
    return tokenData;
  }
}
export default new TokenService();
