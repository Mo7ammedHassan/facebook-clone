import { catchError } from "../../../../utils/catch-error";
import { Request, Response } from "express";
import discoverMembersService from "./service";
const discoverMembersController = catchError(
  async (req: Request, res: Response) => {
    const groupId = +req.params.groupId;
    const userId = +req.user.id;
    const limit = Number(req.query.limit) || 10;
    const cursor = Number(req.query.cursor) || undefined;
    if (!groupId || isNaN(groupId)) {
      return res.status(400).json({
        success: false,
        message: "A valid group ID is required",
      });
    }

    const members = await discoverMembersService(
      userId,
      groupId,
      limit,
      cursor,
    );
    res.status(200).json(members);
  },
);

export default discoverMembersController;
