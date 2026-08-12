import { catchError } from "../../../utils/catch-error";
import { Request, Response } from "express";
import rejectRequestService from "./service";
const rejectRequestController =catchError(async (req:Request, res:Response) => {
    
    const userId= req.user.id;
    const requesterId = +req.params.id;
    if (!requesterId || isNaN(requesterId)) {
         return res.status(400).json({
            success: false,
            message: "A valid friend ID is required",
        });
    }
    await rejectRequestService(userId, requesterId);
    res.status(200).json({
        success: true,
        message: "request rejected successfully",
    });
})

export default rejectRequestController