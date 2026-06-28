import express from "express";
import registerController from "./register/controller";
import loginController from "./login/controller";
import { loginSchema } from "./login/validation";
import validate from "../../middlewares/validate-body.middleware";
import { registerSchema } from "./register/validation";

const authRouter= express.Router();

authRouter.post("/register", validate(registerSchema),registerController)

authRouter.post("/login", validate(loginSchema),loginController)


export default authRouter