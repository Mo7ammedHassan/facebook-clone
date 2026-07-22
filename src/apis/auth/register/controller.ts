import { NextFunction, Request, Response, RequestHandler } from "express";
import { registerUser } from "./service";
import AppError from "../../../utils/app-error";
import cookieOptions from "../../../options/cookie-options";
import { IResponseUser, IRequestUser } from "./types";
import { catchError } from "../../../utils/catch-error";

 const registerController: RequestHandler<
  {},
  IResponseUser,
  IRequestUser
> = catchError(async (req: Request, res: Response, next: NextFunction) => {

    // console.log(req.body);
    const { email, password, name, confirmPassword, dbo } = req.body;

    if (!email || !password || !name || !dbo || !confirmPassword) {
      throw new AppError("Missing required fields", 400);
    }
    const dateOfBirthStr = dbo;
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