import { catchError } from "../../../utils/catch-error";
import { Request, Response } from "express";
import cancelRequestService from "./service";
const cancelRequestController = catchError(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const requesterId = +req.params.id;
    if (!requesterId || isNaN(requesterId)) {
      return res.status(400).json({
        success: false,
        message: "A valid friend ID is required",
      });
    }

    await cancelRequestService(userId, requesterId);
    res.status(200).json({
      success: true,
      message: "Friend request canceled successfully",
    });
  },
);

export default cancelRequestController;