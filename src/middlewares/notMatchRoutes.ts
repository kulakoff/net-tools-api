import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/apiError";

const notMatchRoutes = (req: Request, res: Response, next: NextFunction) => {
  next(
    ApiError.NotFound("Unknown routes", [
      `Route '${req.originalUrl}' not found`,
    ])
  );
};

export default notMatchRoutes;
