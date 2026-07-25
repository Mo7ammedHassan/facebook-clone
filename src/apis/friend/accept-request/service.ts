import FriendRepository, {
  friendShipStatus,
} from "../../../Repositories/friends.repository";
import AppError from "../../../utils/app-error";

const friendRepo = new FriendRepository();

const acceptRequestService = async (userId: number, requesterId: number) => {
  const friendship = await friendRepo.getFriendshipStatus(userId, requesterId);

  if (!friendship) {
    throw new AppError("Friend request not found", 404);
  }
  
  if (friendship.friendId !== userId) {
    throw new AppError("You cannot accept a friend request you sent", 403);
  }

  if (friendship.status === friendShipStatus.accepted) {
    throw new AppError("You are already friends", 400);
  }

  if (friendship.status !== friendShipStatus.pending) {
    throw new AppError("No pending friend request found", 400);
  }


  // The requester is stored in `userId`; the logged-in user is `friendId`.
  const result = await friendRepo.acceptRequest(requesterId, userId);

  if (result.count === 0) {
    throw new AppError("No pending friend request found", 400);
  }

  return result;
};

export default acceptRequestService;
