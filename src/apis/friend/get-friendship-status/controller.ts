import { catchError } from "../../../utils/catch-error";
import { Request, Response } from "express";
import getFriendshipStatusService from "./service";
const getFriendshipStatusController = catchError(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const friendId = +req.params.id;
    if (!friendId || isNaN(friendId)) {
        return res.status(400).json({
            success: false,
            message: "A valid friend ID is required",
        });
    }
    const friendshipStatus = await getFriendshipStatusService(+userId, +friendId);
    res.status(200).json({
        success: true,
        data: {
            friendshipStatus,
        },
    });
});

export default getFriendshipStatusController;