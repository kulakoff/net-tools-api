import { NextFunction, Request, Response } from 'express';
import ApiError from '../exceptions/apiError';

export const restrictTo =
  (...allowedRoles: string[]) =>
    // (allowedRole: string) =>
    (req: Request, res: Response, next: NextFunction) => {
      const user = res.locals.user;
      console.log(user)
      const checkRoles = allowedRoles.includes(user.roles)
      console.log("allowedRoles : ", allowedRoles)
      console.log("checkRoles: ", checkRoles)
      if (!user.roles.some((role: string) => allowedRoles.includes(role))) {
        return next(
          ApiError.Forbidden('You are not allowed to perform this action')
        );
      }
      next();
    };
