import { Request, Response } from "express";
import { catchError } from "../../../utils/catch-error";
import softDeletePostService from "./service";

const softDeletePostController = catchError(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const postId = +req.params.postId;
    if (!postId || isNaN(postId)) {
      return res.status(400).json({
        success: false,
        message: "A valid post ID is required",
      });
    }
    await softDeletePostService( postId, userId);
    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  },
);

export default softDeletePostController;
