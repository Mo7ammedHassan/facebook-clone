import GroupRole from "../../../../enums/group-role";
import GroupRepository from "../../../../Repositories/group.repository";
import AppError from "../../../../utils/app-error";
const groupRepo = new GroupRepository();
const updateRoleService = async (
  groupId: number,
  actorId: number,
  targetUserId: number,
  role: GroupRole,
) => {
  const [group, owner, target] = await Promise.all([
    groupRepo.getGroup(groupId),
    groupRepo.getMember(groupId, actorId),
    groupRepo.getMember(groupId, targetUserId),
  ]);
  if(!group)
    throw new AppError("Group not found", 404);

  if(owner?.role!==GroupRole.owner)
    throw new AppError("You are not a owner of this group", 400);

  if(!target)
    throw new AppError("User not found or not a member in this group", 404);

  if(target.role===role)
    throw new AppError(`this user is already ${role}`, 400);

  if(target.role===GroupRole.owner && role===GroupRole.owner)
    throw new AppError("You can't change role of owner", 400);

  return await groupRepo.updateMemberRole(groupId, targetUserId, role);
};

export default updateRoleService;
