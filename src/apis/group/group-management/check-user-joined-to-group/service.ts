import GroupRepository from "../../../../Repositories/group.repository";
import AppError from "../../../../utils/app-error";

const groupRepo = new GroupRepository();

const checkUserJoinedToGroupService = async (
  groupId: number,
  userId: number,
) => {
  const group = await groupRepo.getGroup(groupId);

  if (!group) {
    throw new AppError("Group not found", 404);
  }

  const membership = await groupRepo.thisUserIsMember(groupId, userId);
  return Boolean(membership);
};

export default checkUserJoinedToGroupService;
