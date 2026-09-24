import GroupRepository from "../../../../Repositories/group.repository";
import AppError from "../../../../utils/app-error";

const groupRepo = new GroupRepository();

const requestJoinToGroupService = async (groupId: number, userId: number) => {
  const [checkRequest, checkMember, group] = await Promise.all([
    groupRepo.thisUserRequestToJoin(groupId, userId),
    groupRepo.thisUserIsMember(groupId, userId),
    groupRepo.getGroup(groupId),
  ]);

  if (!group) throw new AppError("Group not found", 404);

  if (checkMember)
    throw new AppError("You are already a member of this group", 400);

  if (checkRequest) {
    if (checkRequest.status === "pending")
      throw new AppError(
        "You have already sent a request to join this group",
        400,
      );

    if (checkRequest.status === "rejected")
      throw new AppError(
        "Sorry, you are banned from entering this group.",
        400,
      );
  }
  if (!group.isOpen) 
    return await groupRepo.requestJoinToGroup(groupId, userId);
  
  else 
    return await groupRepo.addUser(groupId, userId);
};

export default requestJoinToGroupService;
