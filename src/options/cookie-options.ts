import { CookieOptions } from "express";
import environment from "../config/environment";

  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    httpOnly: true,
    sameSite: "strict",
    secure: environment.ModeEnv === "production",
  };

export default cookieOptions