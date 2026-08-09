import GroupRepository from "../../../../Repositories/group.repository";
import AppError from "../../../../utils/app-error";
import GroupRole from "../../../../enums/group-role";
import GroupStatusRequest from "../../../../enums/group-status-requests";
const groupRepo = new GroupRepository();

const updateGroupRequestStatusService = async (
  requestId: number,
  actorId: number,
  status: GroupStatusRequest,
) => {
  // handel request
  const request = await groupRepo.getRequestJoinById(requestId);

  if (!request) throw new AppError("Request not found", 404);

  const { groupId, userId: requesterId } = request;
  // handel requester
  if (request.status === GroupStatusRequest.accepted)
    throw new AppError("this user is already a member of this group", 400);

  const member = await groupRepo.getMember(groupId, actorId);

  // handel permission
  if (!member) throw new AppError("You are not a member of this group", 400);

  if (member.role !== GroupRole.owner && member.role !== GroupRole.admin)
    throw new AppError(
      "You do not have permission to perform this action",
      403,
    );

  // handel status
  if (request.status === status)
    throw new AppError(`This request is already ${status.toLowerCase()}`, 400);

  if (status === GroupStatusRequest.accepted)
    return await groupRepo.acceptGroupRequest(
      requestId,
      groupId,
      requesterId,
      actorId,
    );

  if (status === GroupStatusRequest.rejected)
    return await groupRepo.rejectGroupRequest(requestId, actorId);
};

export default updateGroupRequestStatusService;
