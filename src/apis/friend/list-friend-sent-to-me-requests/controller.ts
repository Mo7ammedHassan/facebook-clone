import { catchError } from "../../../utils/catch-error";
import { Request, Response } from "express";
import listFriendSentToMeRequestsService from "./service";
const listFriendSentToMeRequestsController = catchError(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const requests = await listFriendSentToMeRequestsService(userId);
    if(requests.length === 0){
        res.status(200).json({
            success: true,
            data: [],
        });
    }
    res.status(200).json({
      success: true,
      data: requests,
    });
  },
);

export default listFriendSentToMeRequestsController;
