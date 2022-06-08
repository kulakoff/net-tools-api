const jwt = require("jsonwebtoken");
const { TokenModel } = require("../models/tokenModel");

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRESIN || "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRESIN || "7d",
    });
    return { accessToken, refreshToken };
  }

  valdateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      // console.log("validateRefreshToken userData:", userData);
      return userData;
    } catch (error) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    //поиск документа
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
  async updateToken(userId, newRefreshToken, oldRefreshToken) {
    const tokenData = await TokenModel.findOne({ user: userId });
    if (tokenData) {
      const filteredToken = await tokenData.refreshToken.filter(
        (rt) => rt !== oldRefreshToken
      );
      // console.log("| updateToken | filteredToken: ",filteredToken)
      tokenData.refreshToken = [...filteredToken, newRefreshToken];
      // console.log("| updateToken | tokenData: ", tokenData);
      return tokenData.save();
    }
  }

  async clearToken(refreshToken) {
    const tokenData = await TokenModel.findOne({ refreshToken });
    console.log("TokenService.clearToken | tokenData: ", tokenData);
    // console.log("newRefreshToken: ", newRefreshToken);
    if (tokenData) {
      tokenData.refreshToken = await tokenData.refreshToken.filter(
        (rt) => rt !== refreshToken
      ); ///
      return await tokenData.save();
    }
  }

  async removeToken(refreshToken) {
    const tokenData = await TokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await TokenModel.findOne({ refreshToken }).exec();
    return tokenData;
  }
}
module.exports = new TokenService();
