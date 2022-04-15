const ApiError = require("./../exceptions/apiError");
const tokenService = require("../service/tokenService");

const authMiddleware = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      console.log("1");
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      console.log("2");
      return next(ApiError.UnauthorizedError());
    }

    const userData = tokenService.valdateAccessToken(accessToken);
    console.log("authMiddleware userData: ", userData);
    if (!userData) {
      console.log("3");
      return next(ApiError.UnauthorizedError());
    }

    req.user = userData;
    next();
  } catch (error) {
    console.log("4");
    return next(ApiError.UnauthorizedError());
  }
};

module.exports = authMiddleware;
