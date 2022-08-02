import { NextFunction, Request, Response } from 'express';
import ApiError from '../exceptions/apiError';

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return next(
        ApiError.UnauthorizedError("Invalid token or session has expired"))
    }

    next();
  } catch (err: any) {
    next(err);
  }
};
