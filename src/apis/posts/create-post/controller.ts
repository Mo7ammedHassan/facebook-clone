import { CreatePostDTO } from "./types";
import { Request, Response } from "express";
import { catchError } from "../../../utils/catch-error";
import createPostService from "./service";
import { randomBytes } from "node:crypto";

const createPostController = catchError(
  async (req: Request<{}, {}, CreatePostDTO>, res: Response) => {
    const userId = req.user.id;
    const { content, groupId } = req.body;

    const files = req.files as any;
    let images;
    if (files && files.length > 0) {
      images = files.map((file: any) => ({
        publicId: `local-${Date.now()}-${file.orderIndex}-${randomBytes(8).toString("hex")}`,
        fileName: file.originalname,
        filePath: file.path,
        orderIndex: file.orderIndex,
      }));
    }
    const postData: CreatePostDTO = {
      userId,
      content: content || undefined,
      groupId: groupId ? Number(groupId) : null,
      images,
    };
    const newPost = await createPostService(postData);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: newPost,
    });
  },
);

export default createPostController;
