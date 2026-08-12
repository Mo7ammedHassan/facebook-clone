import friendShipStatus from "../../../enums/friend-ship-status";
import FriendRepository from "../../../Repositories/friends.repository";
import AppError from "../../../utils/app-error";

const friendRepo = new FriendRepository();

const rejectRequestService = async (
  currentUserId: number,
  targetUserId: number,
) => {
const result = await friendRepo.rejectRequest(currentUserId, targetUserId);

if (result.count > 0) {
  return result;
}
const existingRequest = await friendRepo.getFriendshipStatus(currentUserId, targetUserId);


if (!existingRequest) {
  throw new AppError("Request not found", 404);
}


if (existingRequest.userId === currentUserId) {
  throw new AppError("You cannot reject a request you sent. Use cancel instead", 403);
}

if (existingRequest.status === friendShipStatus.accepted) {
  throw new AppError("This request is already accepted", 400);
}

if (existingRequest.status === friendShipStatus.rejected) {
  throw new AppError("This request is already rejected", 400);
}
};

export default rejectRequestService;
