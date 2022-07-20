import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/apiError";

const userRolesVerify = (...allowedRoles: number[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.body.user.roles) return next(ApiError.UnauthorizedError())
            const rolesArray = [...allowedRoles]
            console.log(rolesArray);
            console.log("userRolesMiddleware userData: >>>", req.body.user)
            const result = req.body.user.roles.map((role: number) => rolesArray.includes(role)).find((val: any) => val === true);
            console.log("result: ", result)
            if (!result) return next(ApiError.UnauthorizedError());
            next();
        } catch (error) {
            console.log(error);
            return next(ApiError.UnauthorizedError());
        }
    }
}

export default userRolesVerify