import { Router } from "express";
import updateProfileController from "./profile/update-data/controller";
import { authenticate } from "../../middlewares/authentication";

const userRouter = Router();

userRouter.use(authenticate)

userRouter.patch("/profile/me/update-data",updateProfileController);

export default userRouter