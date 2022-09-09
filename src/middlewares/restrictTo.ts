import { NextFunction, Request, Response } from 'express';
import ApiError from '../exceptions/apiError';

export const restrictTo =
  (...allowedRoles: string[]) =>
    (req: Request, res: Response, next: NextFunction) => {
      const user = res.locals.user;
      const checkRoles = allowedRoles.includes(user.roles)
      if (!user.roles.some((role: string) => allowedRoles.includes(role))) {
        return next(
          ApiError.Forbidden('You are not allowed to perform this action')
        );
      }
      next();
    };
