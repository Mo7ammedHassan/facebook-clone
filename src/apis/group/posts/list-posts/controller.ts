import { catchError } from "../../../../utils/catch-error";
import { Request, Response } from "express";
import listPostsService from "./service";
import { size } from "zod";
import postStatus from "../../../../enums/post-status";
const listPostsController = catchError(async (req: Request, res: Response) => {
  const groupId = +req.params.groupId;
  const userId = +req.user.id;
  const status = req.query.status as postStatus | undefined
  if (!groupId || isNaN(groupId)) {
    return res.status(400).json({
      success: false,
      message: "A valid group ID is required",
    });
  }
  const posts = await listPostsService(userId, groupId, status);
  if (posts.length === 0) {
    res.status(200).json({
      success: true,
      data: [],
    });
  }
  res.status(200).json({
    success: true,
    data: posts,
  });
});

export default listPostsController;
