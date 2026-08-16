import { catchError } from "../../../../utils/catch-error";
import { Request, Response } from "express";
import getProfileByUsernameService from "./service";

const getProfileByUsernameController = catchError(
  async (req: Request, res: Response) => {
    const username = req.params.username as string;
    const currentUserId = +req.user.id;

    const profileData = await getProfileByUsernameService(
      currentUserId,
      username,
    );

    return res.status(200).json({
      success: true,
      data: profileData,
    });
  },
);

export default getProfileByUsernameController;