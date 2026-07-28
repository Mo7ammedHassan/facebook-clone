import { catchError } from "../../../utils/catch-error";
import { Request, Response } from "express";
import requestJoinToGroupService from "./service";
const requestJoinToGroupController = catchError(
    async (req: Request, res: Response) => {
    const userId = req.user.id;
    const groupId = +req.params.groupId;

    if (!groupId || isNaN(groupId)) {
        return res.status(400).json({
            success: false,
            message: "A valid group ID is required",
        });
    }

    await requestJoinToGroupService(groupId, userId);

    res.status(200).json({
        success: true,
        message: "Group join request sent successfully",
    });
      
});

export default requestJoinToGroupController