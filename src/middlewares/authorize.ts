import { NextFunction, Request, Response, RequestHandler } from "express";
import AppError from "../utils/app-error";
import Role from "../enums/role.enum";

export const restrictTo = (...roles: Role[]): RequestHandler => {//isAuthorized
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("unauthenticated. Please log in.", 401));
    }

    // 2. تشييك الصلاحيات (الـ Roles)
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden. You do not have permission to perform this action", 403));
    }

    next();
  };
};