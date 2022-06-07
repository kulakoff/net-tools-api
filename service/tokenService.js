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
      console.log("validateRefreshToken userData:", userData);
      return userData;
    } catch (error) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await TokenModel.findOne({ user: userId });
    console.log("TokenService.saveToken | tokenData: ", tokenData);
    if (tokenData) {
      tokenData.refreshToken = await tokenData.refreshToken.filter(
        (rt) => rt !== refreshToken
      ); ///
      console.log("QQQ",tokenData.refreshToken)
      // tokenData.refreshToken = [...tokenData.refreshToken, refreshToken];

      return tokenData.save();
    }
    const token = await TokenModel.create({ user: userId, refreshToken });
    return token;
  }

  async saveToken2(userId, newRefreshToken) {
    const tokenData = await TokenModel.findOne({ user: userId });
    console.log("TokenService.saveToken2 | tokenData: ", tokenData);
    console.log("newRefreshToken: ", newRefreshToken);
    if (tokenData) {
      tokenData.refreshToken = [...newRefreshToken.refreshToken];
      return await tokenData.save();
    }
    // const token = await TokenModel.create({ user: userId, refreshToken });
    // return token;
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
