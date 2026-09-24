import { Request, Response } from "express";
import { catchError } from "../../../../utils/catch-error";
import groupDetailsService from "./service";
const groupDetailsController = catchError(
  async (req: Request, res: Response) => {
    const groupId  = +req.params.groupId;
    if (!groupId || isNaN(groupId)) {
      return res.status(400).json({
        success: false,
        message: "A valid group ID is required",
      });
    }
    // console.log(`groupId: ${groupId} and type of groupId: ${typeof groupId}`);
    const groupDetails = await groupDetailsService(groupId);
    res.status(200).json(groupDetails);
  },
);

export default groupDetailsController;