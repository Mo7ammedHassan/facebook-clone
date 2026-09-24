import { Request, Response } from "express";
import { catchError } from "../../../../utils/catch-error";
import checkUserJoinedToGroupService from "./service";

const checkUserJoinedToGroupController = catchError(
  async (req: Request, res: Response) => {
    const groupId = +req.params.groupId;
    const userId = req.user.id;

    if (!groupId || isNaN(groupId)) {
      return res.status(400).json({
        success: false,
        message: "A valid group ID is required",
      });
    }

    const isJoined = await checkUserJoinedToGroupService(groupId, userId);

    return res.status(200).json({
      success: true,
      data: { isJoined },
    });
  },
);

export default checkUserJoinedToGroupController;
