import { Request, Response, NextFunction } from "express";
import ApiError from "./../exceptions/apiError";
import tokenService from "../service/tokenService";
// interface IExpressRequest extends Request {
//   user:any
// }

/**
 * Валидация JWT
 * @param req 
 * @param res 
 * @param next 
 * @returns modify req.user from JWT token
 */
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      console.log("|DEBUG|Отсутствует заголовок|");
      return next(ApiError.UnauthorizedError());
    }

    const accessToken: string = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      console.log("|DEBUG|Отсутствует токен|");
      return next(ApiError.UnauthorizedError());
    }

    const userData: any = tokenService.valdateAccessToken(accessToken);
    if (!userData) {
      console.log("|DEBUG|Некорректный токен доступа|");
      return next(ApiError.UnauthorizedError());
    }
    //Добавляем данные пользователя из валидного токена к заапросу
    req.body.user = userData;
    // req.user = userData;
    // console.table(req.user);
    next();
  } catch (error) {
    console.log("|DEBUG|authMiddleware error| ", error);
    return next(ApiError.UnauthorizedError());
  }
};

export default authMiddleware;
