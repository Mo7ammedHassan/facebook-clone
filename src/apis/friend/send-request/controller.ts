import { catchError } from "../../../utils/catch-error";
import { Request, Response } from "express";
import addFriendService from "./service";
const addFriendController = catchError(async (req: Request, res: Response) => {
    const targetUserId = +req.params.id;
    const userId = req.user.id;
    if(!targetUserId){
      return  res.status(400).json({
            success: false,
            message: "Friend id is required",
        });
    }
    await addFriendService(userId, targetUserId);
    return res.status(201).json({
        success: true,
        message: "Friend request sent successfully",
    });
});

export default addFriendController;

