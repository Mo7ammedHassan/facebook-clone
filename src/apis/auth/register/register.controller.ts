import { NextFunction, Request, Response, RequestHandler } from "express";
import { registerUser } from "./register.service";
import AppError from "../../../utils/app-error";
import cookieOptions from "../../../options/cookie-options";
import { IResponseUser, IRequestUser } from "./register.types";
import { catchError } from "../../../utils/catch-error";

 const registerController: RequestHandler<
  {},
  IResponseUser,
  IRequestUser
> = catchError(async (req: Request, res: Response, next: NextFunction) => {

    const { email, password, name, confirmPassword, dateOfBirthStr } = req.body;

    

    if (!email || !password || !name || !dateOfBirthStr || !confirmPassword) {
      throw new AppError("Missing required fields", 400);
    }

    const result = await registerUser(
      email,
      password,
      name,
      dateOfBirthStr,
      confirmPassword,
    );

    res.cookie("refreshToken", result.refreshToken, cookieOptions);

    res.status(201).json({
      status: "success",
      token: result.token,
      data: {
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
        },
      },
    });
  });

export default registerController;