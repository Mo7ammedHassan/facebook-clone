import { count } from "node:console";
import GroupRepository from "../../../../Repositories/group.repository";
import AppError from "../../../../utils/app-error";

const groupRepo = new GroupRepository();

const groupDetailsService = async (groupId: number) => {
  const group = await groupRepo.getGroupDetails(groupId);
  if (!group) 
    throw new AppError("Group not found", 404);
  let groupDetails = {
    id: group.id,
    name: group.name,
    description: group.description,
    cover: group.cover,
    createdAt: group.createdAt.toLocaleDateString("en-UK"),
    privacy: group.isPrivate,
    canAnyOneJoin: group.isOpen,
    canAnyOneWritePost: group.canAnyOneWritePost,
    rules: group.rules,
    countMembers: group._count.members,
    countPosts: group._count.posts,
    owner: group.members.find((member) => member.role === "owner")?.user,
    admins: group.members.filter((member) => member.role === "admin").map((member) => member.user),
};
  return groupDetails;

};

export default groupDetailsService;
