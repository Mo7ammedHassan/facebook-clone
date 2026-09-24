import GroupRole from "../../../../enums/group-role";
import postStatus from "../../../../enums/post-status";
import GroupRepository from "../../../../Repositories/group.repository";
import AppError from "../../../../utils/app-error";

const groupRepo = new GroupRepository();

const getPostsUnapprovedService = async (
  groupId: number,
  userId: number,
  status?: postStatus,
) => {
  const [member, group] = await Promise.all([
    groupRepo.getMember(groupId, userId),
    groupRepo.getGroup(groupId),
  ]);
  status = status ? status : postStatus.approved;

  if (!group) throw new AppError("Group not found", 404);
  if (group.isPrivate) {
    if (!member) throw new AppError("You are not a member of this group", 403); //not member in private group

    if (status === postStatus.pending || status === postStatus.rejected)
      if (member.role !== GroupRole.member)
        throw new AppError(`Unauthorized to view ${status}  posts`, 403); //is member want to see pending or rejected posts but not admin or owner
  }
  return await groupRepo.listPosts(groupId, status);

};

export default getPostsUnapprovedService;
