import GroupRepository from "../../../../Repositories/group.repository";
import AppError from "../../../../utils/app-error";

const groupRepo = new GroupRepository();
const listPostsService = async (userId: number, groupId: number) => {
  const [member, group] = await Promise.all([
    groupRepo.getMember(groupId, userId),
    groupRepo.getGroup(groupId),
  ]);

  if (!group) 
    throw new AppError("Group not found", 404);
  if (group.isPrivate && !member)
    throw new AppError("You are not a member of this group", 403);

  return await groupRepo.listPosts(groupId);
};

export default listPostsService;
