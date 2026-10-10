import { Request, Response } from "express";
import { catchError } from "../../../../utils/catch-error";
import leaveGroupService from "./service";

const leaveGroupController = catchError(
  async (req: Request, res: Response) => {
    const groupId = +req.params.groupId;
    const userId = +req.user.id;
    if (!groupId || isNaN(groupId)) {
      return res.status(400).json({
        success: false,
        message: "A valid group ID is required",
      });
    }
    await leaveGroupService(groupId, userId);
    return res.status(200).json({
      success: true,
      message: "Group left successfully",
    });
  },
);

export default leaveGroupController;
