import { catchError } from "../../../utils/catch-error";
import { Request, Response } from "express";
import deleteFriendService from "./service";
const deleteFriendController = catchError(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const targetUserId = +req.params.id;
    if (!targetUserId || isNaN(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "A valid friend ID is required",
      });
    }
    await deleteFriendService(userId, targetUserId);
    res.status(200).json({
      success: true,
      message: "Friendship deleted successfully",
    });
  },
);

export default deleteFriendController;
