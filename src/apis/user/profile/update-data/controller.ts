import { Request, Response } from "express";
import { catchError } from "../../../../utils/catch-error";
import updateProfileService from "./service";
import updateProfileData from "./types";
import AppError from "../../../../utils/app-error";

const updateProfileController = catchError(
  async (
    req: Request<{}, { message: string }, updateProfileData>,
    res: Response,
  ) => {
    const userId = +req.user.id;
    const {...data} = req.body;
    // if(typeof data.isPrivate === "boolean"){
    //     throw new AppError("isPrivate must be a boolean (true or false)",400);
    // }
    // if(data.gender!=="male" && data.gender!=="female"){
    //     throw new AppError("gender must be male or female",400);
    // }
    // if(data.dateOfBirth)
    await updateProfileService(userId, data);

    return res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  },
);

export default updateProfileController;
