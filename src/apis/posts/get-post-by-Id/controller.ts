import { Request, Response } from "express";
import { catchError } from "../../../utils/catch-error";
import getPostByIdService from "./service";

const getPostByIdController = catchError(async (req:Request, res:Response) => {

    const postId = +req.params.postId;
    const userId = req.user.id;
    if (!postId || isNaN(postId)) {
      return res.status(400).json({
        success: false,
        message: "A valid post ID is required",
      });
    }
    const post = await getPostByIdService(userId, postId);
    return res.status(200).json({
      success: true,
      data: post,
    });
});

export default getPostByIdController