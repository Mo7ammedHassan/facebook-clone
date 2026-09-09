import { CreatePostWithoutImageDTO } from "./types";
import { Request, Response } from "express";
import { catchError } from "../../../utils/catch-error";
import createPostWithoutImageService from "./service";

const createPostWithoutImageController = catchError(
  async (req: Request<{}, {}, CreatePostWithoutImageDTO>, res: Response) => {
    const userId = req.user.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const postData: CreatePostWithoutImageDTO = {
      userId,
      content,
    };
    const newPost = await createPostWithoutImageService(postData);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: newPost,
    });
  },
);

export default createPostWithoutImageController;
