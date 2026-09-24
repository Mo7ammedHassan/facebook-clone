import GroupRepository from "../../../../Repositories/group.repository";
import AppError from "../../../../utils/app-error";
import { formatRelativeTimeEnglish } from "../../../../utils/formatRelativeTime";

const groupRepo = new GroupRepository();

const discoverMembersService = async (
  userId: number,
  groupId: number,
  limit: number,
  cursor?: number,
) => {
  const [group, members, userIsMember] = await Promise.all([
    groupRepo.getGroup(groupId),
    groupRepo.getMembers(groupId, limit, cursor),
    groupRepo.getMember(groupId, userId),
  ]);

  if (!group) throw new AppError("Group not found", 404);

  if (group.isPrivate && !userIsMember)
    throw new AppError("You are not a member of this group", 403); //not member in private group

  const result = members.map((member) => ({
    memberShipId: member.id,
    userId: member.user.id,
    name: member.user.name,
    avatar: member.user.image?.filePath,
    joinedAt: formatRelativeTimeEnglish(member.joinedAt),
    role: member.role,
  }));
  return {
    result,
    cursor: members.length === limit ? members[members.length - 1].id : null,
  };
};

export default discoverMembersService;
