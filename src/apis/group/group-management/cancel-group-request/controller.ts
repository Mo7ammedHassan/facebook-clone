import { Request, Response } from "express";
import { catchError } from "../../../../utils/catch-error";
import cancelGroupRequestService from "./service";
const cancelGroupRequestController = catchError(
  async (req: Request, res: Response) => {
    const requestId = +req.params.requestId;
    if (!requestId || isNaN(requestId)) {
      return res.status(400).json({
        success: false,
        message: "A valid request ID is required",
      });
    }
    await cancelGroupRequestService(requestId);
    return res.status(200).json({
      success: true,
      message: "Group join request cancelled",
    });
  },
);
export default cancelGroupRequestController;
