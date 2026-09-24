import { Request, Response } from "express";
import { catchError } from "../../../../utils/catch-error";
import GroupRole from "../../../../enums/group-role";
import updateRoleService from "./service";

const updateRoleController = catchError(async (req: Request, res: Response) => {
  const actorId = +req.user.id;
  const targetUserId = +req.params.targetUserid;
  const groupId = +req.params.groupId;
  const { role } = req.body;
  if (!groupId || isNaN(groupId)) {
    return res.status(400).json({
      success: false,
      message: "A valid group ID is required",
    });
  }
  if (!targetUserId || isNaN(targetUserId)) {
    return res.status(400).json({
      success: false,
      message: "A valid target user ID is required",
    });
  }
  if (role !== GroupRole.admin && role !== GroupRole.member) {
    return res.status(400).json({
      success: false,
      message:
        "A valid role is required (admin or member) if you want update to owner you can do transfer ownership",
    });
  }

  const updatedRole = await updateRoleService(
    groupId,
    actorId,
    targetUserId,
    role,
  );
  return res.status(200).json({
    success: true,
    data: updatedRole,
    message: "Role updated successfully",
  });
});

export default updateRoleController;
