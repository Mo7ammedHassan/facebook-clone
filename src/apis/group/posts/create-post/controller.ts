import { CreatePostDTO } from "./types";
import { Request, Response } from "express";
import { catchError } from "../../../../utils/catch-error";
import createPostService from "./service";
import { randomBytes } from "node:crypto";
const createPostController = catchError(
  async (req: Request<any, any, CreatePostDTO>, res: Response) => {
    const userId = req.user.id;
    const groupId = +req.params.groupId;
    const { content } = req.body;
    if (!groupId) {
      res.status(400).json({
        success: false,
        message: "Group id is required",
      });
    }

    if (!content) {
      res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }
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
      groupId: Number(groupId),
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
