import ApiError from "./../exceptions/apiError";
import { Request, Response, NextFunction } from "express";

//TODO доделать типизацию для err
const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: "Непредвиденная ошибка" });
};

export default errorMiddleware;
