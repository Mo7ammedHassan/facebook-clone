import { NextFunction, Request, RequestHandler, Response } from "express";
import { IRequestUser, IResponseUser } from "./types";
import AppError from "../../../utils/app-error";
import loginUser from "./service";
import cookieOptions from "../../../options/cookie-options";
import { catchError } from "../../../utils/catch-error";

const loginController: RequestHandler<{}, IResponseUser, IRequestUser, {}, {}> = catchError(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Missing required fields", 400);
    }
    const user = await loginUser(email, password);
    res.cookie("refreshToken", user.refreshToken, cookieOptions);
    res.status(201).json({
      status: "success",
      token: user.token,
      data: {
        user: {
          id: user.user.id,
          name: user.user.name,
          email: user.user.email,

        },
      },
    });
  } catch (err: any) {
    next(err);
  }
});

export default loginController;
