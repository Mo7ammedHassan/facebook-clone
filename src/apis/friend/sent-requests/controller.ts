import { catchError } from "../../../utils/catch-error";
import { Request, Response } from "express";
import sentRequestsService from "./service";
const sentRequestsController =catchError( async (req: Request, res: Response) => {

    const userId = req.user.id;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const requests = await sentRequestsService(userId, limit, cursor);
    return res.status(200).json({
        success: true,
        data: requests,
    });
})

export default sentRequestsController