import { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error";
import jwt from "jsonwebtoken";

import environment from "../config/environment";
import UserRepository from "../apis/auth/Repositories/user.repo";
import Role from "../enums/role.enum";


interface JwtPayload {
  id: number;
  iat: number;
  exp: number;
}

// عمل الـ Instance برة عشان الأداء وسرعة الـ Request
const userRepo = new UserRepository();

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = "";

    // 1. الاستخراج السليم للـ Token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not logged in. Please log in to get access", 401),
      );
    }

    // 2. عمل Verify للتوكن بالـ Access Secret القياسي
    const decoded = jwt.verify(
      token,
      environment.JWT_TOKEN_SECRET_KEY, 
    ) as JwtPayload;

    const id = +decoded.id;
    const currentUser = await userRepo.findById(id);

    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401),
      );
    }

    // 3. تخزين الداتا جوه الـ req (سيب الـ Role كابيتال أو زي ما هي في الـ DB)
    req.user = {
      id: id,
      role: currentUser.role as Role, 
      email: currentUser.email,
    };
    
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new AppError("Token expired. Please log in again.", 401));
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid token. Please log in again.", 401));
    }
    next(err); // حماية الكود من الـ Freezing لو حصل إيرور غير متوقع
  }
};