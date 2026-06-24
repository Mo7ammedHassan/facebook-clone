import express from "express";
import registerController from "./register/register.controller";


const authRouter= express.Router();

authRouter.post("/register", registerController)

export default authRouter