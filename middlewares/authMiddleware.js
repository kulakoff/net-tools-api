const ApiError = require("./../exceptions/apiError");
const tokenService = require("../service/tokenService");

const authMiddleware = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      console.log("|DEBUG|Отсутствует заголовок|");
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      console.log("|DEBUG|Отсутствует токен|");
      return next(ApiError.UnauthorizedError());
    }

    const userData = tokenService.valdateAccessToken(accessToken);
    if (!userData) {
      console.log("|DEBUG|Не корректный токен доступа|");
      return next(ApiError.UnauthorizedError());
    }
    //Добавляем данные пользователя из валидного токена к заапросу
    req.user = userData;
    // console.table(req.user);
    next();
  } catch (error) {
    console.log("|DEBUG|authMiddleware error| ", error);
    return next(ApiError.UnauthorizedError());
  }
};

module.exports = authMiddleware;
