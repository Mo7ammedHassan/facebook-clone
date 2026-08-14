import friendShipStatus from "../../../enums/friend-ship-status";
import FriendRepository from "../../../Repositories/friends.repository";
import UserRepository from "../../../Repositories/user.repository";
import AppError from "../../../utils/app-error";

const friendRepo = new FriendRepository();
const userRepo = new UserRepository();
const sendRequestService = async (senderId: number, receiverId: number) => {
  if (senderId === receiverId) {
    throw new AppError("You cannot send a friend request to yourself", 400);
  }
  const [targetUser, existingRelation] = await Promise.all([
    userRepo.findById(receiverId),
    friendRepo.getFriendshipStatus(senderId, receiverId),
  ]);
  if (!targetUser) {
    throw new AppError("User not found", 404);
  }

  if (existingRelation) {
    if (existingRelation.status === friendShipStatus.pending) {
      throw new AppError(
        "A friend request is already pending between you",
        400,
      );
    }
    if (existingRelation.status === friendShipStatus.accepted) {
      throw new AppError("You are already friends", 400);
    }

    if (
      existingRelation.status === friendShipStatus.rejected &&
      existingRelation.userId === senderId
    ) {
      throw new AppError("Your previous request was rejected", 400);
    } else if (
      existingRelation.status === friendShipStatus.rejected &&
      existingRelation.friendId === senderId
    ) {
      await friendRepo.updateRequestRolesAndStatus(
        existingRelation.id,
        senderId,
        receiverId,
      );
      return;
    }
    throw new AppError("Cannot send friend request", 400);
  }
  await friendRepo.sendRequest(senderId, receiverId);
};

export default sendRequestService;
