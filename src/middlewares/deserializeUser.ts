import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions/apiError";
import redisClient from "../dbConnections/redis/connectRedis";
import { verifyJwt } from "../utils/jwt";
import userService from "../service/userService";

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the token. req.headers or req.cookies
    //Получаем токен доступа из cookie или заголовка авторизации
    let accessToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      accessToken = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.accessToken) {
      accessToken = req.cookies.accessToken;
    }

    if (!accessToken)
      return next(ApiError.UnauthorizedError("Token not found"));

    // Validate Access Token
    const tokenDecoded = verifyJwt<{
      sub: string;
      deviceId: string;
    }>(accessToken, "accessTokenPublicKey");

    if (!tokenDecoded)
      return next(
        ApiError.UnauthorizedError("Invalid token or user doesn't exist")
      );

    // Check if user has a valid session
    const session = await redisClient.get(
      `${tokenDecoded.sub}:${tokenDecoded?.deviceId}`
    );

    if (!session)
      return next(ApiError.UnauthorizedError(`User session has expired`));

    //Find user by id from token payload
    const user = await userService.findUserById(tokenDecoded.sub);
    if (!user)
      return next(
        ApiError.UnauthorizedError(`User with that token no longer exist`)
      );

    res.locals.user = user;
    res.locals.deviceId = tokenDecoded.deviceId;

    next();
  } catch (error: any) {
    next(error);
  }
};
