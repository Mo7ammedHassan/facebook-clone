import { catchError } from "../../../../utils/catch-error";
import { Request, Response } from "express";
import listRequestsJoinToGroupService from "./service";
const listRequestsJoinToGroupController = catchError(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const groupId = +req.params.groupId;
    if (!groupId || isNaN(groupId)) {
      return res.status(400).json({
        success: false,
        message: "A valid group ID is required",
      });
    }
    const requests = await listRequestsJoinToGroupService(groupId, userId);
    if (requests.length === 0) {
      res.status(200).json({
        success: true,
        data: [],
      });
    }
    res.status(200).json({
      success: true,
      data: requests,
    });
  },
);

export default listRequestsJoinToGroupController;
