import { catchError } from "../../../utils/catch-error";
import { Request, Response } from "express";
import feedService from "./service";
const feedController = catchError(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
  if(limit > 50) return res.status(400).json({success: false, message: "Limit must be less than 50"});
  const posts = await feedService(userId, limit, cursor);

  const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

  return res.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts,
      nextCursor,
    },
  });
});

export default feedController;
