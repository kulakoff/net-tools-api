import ApiError from "./../exceptions/apiError";
import { Request, Response, NextFunction } from "express";


const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Непредиденная ошибка"

  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ status: err.status,message: err.message, errors: err.errors });
  }
  return res
    .status(err.statusCode)
    .json({ status: err.status, message: err.message });
};

export default errorMiddleware;
