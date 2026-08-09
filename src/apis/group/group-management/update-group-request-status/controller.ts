import { catchError } from "../../../../utils/catch-error";
import { Request, Response } from "express";
import updateGroupRequestStatusService from "./service";
import GroupStatusRequest from "../../../../enums/group-status-requests";
const updateGroupRequestStatusController = catchError(
  async (req: Request, res: Response) => {
    const actorId = req.user.id;
    const requestId = +req.params.requestId;
    const groupId = +req.params.groupId;
    if (!requestId || isNaN(requestId)) {
      return res.status(400).json({
        success: false,
        message: "A valid request ID is required",
      });
    }

    if (!groupId || isNaN(groupId)) {
      return res.status(400).json({
        success: false,
        message: "A valid group ID is required",
      });
    }
    const { status } = req.body;
    await updateGroupRequestStatusService(requestId, actorId, status);
    if (status === GroupStatusRequest.accepted) {
      return res.status(200).json({
        success: true,
        message: "Group join request accepted successfully",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Group join request rejected successfully",
    });
  },
);

export default updateGroupRequestStatusController;
