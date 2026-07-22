import { catchError } from "../../../utils/catch-error";
import { Request, Response } from "express";
import { ICreateGroupController, ICreateGroupService } from "./types";
import { randomBytes } from "node:crypto";
import createGroupService from "./service";
const createGroupController = catchError(async (req: Request<{}, {}, ICreateGroupController>, res: Response) => {
    const { name, description, rules, isOpen, isPrivate} = req.body;
    const userId = req.user.id;
    let groupData = {
        name,
        ownerId: userId,
        optional: {
            description,
            rules,
            isOpen,
            isPrivate,
        }
    }as  ICreateGroupService;

    let file = req.files as any;
    let image;
    if (file) {
        image = {
            publicId: `local-${Date.now()}-${1}-${randomBytes(8).toString("hex")}`,
            fileName: file.originalname,
            filePath: file.path,
        }
    }

    groupData = {
        ...groupData,
        cover: image
    }

    const group = await createGroupService(groupData);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: group,
    });
    


});

    export default createGroupController;