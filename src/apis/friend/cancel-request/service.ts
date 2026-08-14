import FriendRepository from "../../../Repositories/friends.repository";
import AppError from "../../../utils/app-error";

const friendRepo = new FriendRepository();

const cancelRequestService = async (
  currentUserId: number,
  targetUserId: number,
) => {
  const result = await friendRepo.cancelRequest(currentUserId, targetUserId);
  if (result.count === 0) {
    throw new AppError("Request not found",400);
  }
};

export default cancelRequestService;
