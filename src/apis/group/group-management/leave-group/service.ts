import GroupRole from "../../../../enums/group-role";
import GroupRepository from "../../../../Repositories/group.repository";
import AppError from "../../../../utils/app-error";
const groupRepo = new GroupRepository();

const leaveGroupService = async (groupId: number, userId: number) => {
  const [group, member] = await Promise.all([
    groupRepo.getGroup(groupId),
    groupRepo.getMember(groupId, userId),
  ]);
  if (!group) throw new AppError("Group not found", 404);
  if (!member) throw new AppError("You are not a member of this group", 400);
  if (member.role === GroupRole.owner)
    throw new AppError(
      "You can't leave this group because you are the owner if you want leave you can Transfer ownership",
      400,
    );
  return await groupRepo.leave(groupId, userId);
};

export default leaveGroupService;