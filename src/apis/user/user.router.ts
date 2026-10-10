import { Router } from "express";
import updateProfileController from "./profile/update-data/controller";
import { authenticate } from "../../middlewares/authentication";
import getMyProfileController from "./profile/get-my-profile/controller";
import getProfileByUsernameController from "./profile/get-profile-by-username/controller";
import validate from "../../middlewares/validate-body.middleware";
import { updateProfileSchema } from "./profile/update-data/validation";

const userRouter = Router();

userRouter.use(authenticate);

//-------Profile-------

userRouter.patch(
  "/profile/me/update-data",
  validate(updateProfileSchema),
  updateProfileController,
);

userRouter.get("/profile/me", getMyProfileController);

userRouter.get("/profile/:username", getProfileByUsernameController);
export default userRouter;
