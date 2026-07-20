import express from "express";
import registerController from "./register/controller";
import loginController from "./login/controller";
import { loginSchema } from "./login/validation";
import validate from "../../middlewares/validate-body.middleware";
import { registerSchema } from "./register/validation";
import logout from "./logout/controller";

const authRouter= express.Router();

authRouter.post("/register",registerController)

authRouter.post("/login", validate(loginSchema),loginController)

authRouter.post("/login",logout)


export default authRouter