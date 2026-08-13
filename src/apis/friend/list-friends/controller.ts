import { catchError } from "../../../utils/catch-error";
import { Request, Response } from "express";
import listFriendsService from "./service";
const listFriendsController = catchError(async (req: Request, res: Response) => {

    const userId = req.user.id;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const friends = await listFriendsService(userId, limit, cursor);
    return res.status(200).json({
        success: true,
        data: friends,
    });
});

export default listFriendsController;