import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/apiError";

const userRolesVerify = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.body.user.roles) return next(ApiError.UnauthorizedError())
            const rolesArray = [...allowedRoles]
            const result = req.body.user.roles.map((role: string) => rolesArray.includes(role)).find((val: any) => val === true);
            if (!result) return next(ApiError.UnauthorizedError());
            next();
        } catch (error) {
            console.log(error);
            return next(ApiError.UnauthorizedError());
        }
    }
}

export default userRolesVerify