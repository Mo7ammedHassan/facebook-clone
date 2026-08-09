import GroupRole from "../../../../enums/group-role";
import GroupRepository from "../../../../Repositories/group.repository";
import AppError from "../../../../utils/app-error";

const groupRepo = new GroupRepository();
const listRequestsJoinToGroupService = async (
  groupId: number,
  userId: number,
) => {
  if (!(await groupRepo.getGroup(groupId)))
    throw new AppError("Group not found", 404);

  const member = await groupRepo.getMember(groupId, userId);

  if (!member) throw new AppError("You are not a member of this group", 400);

  if (member.role !== GroupRole.owner && member.role !== GroupRole.admin)
    throw new AppError("You are not an admin of this group", 400);

  return await groupRepo.listRequestsJoinToGroup(groupId);
};

export default listRequestsJoinToGroupService;
