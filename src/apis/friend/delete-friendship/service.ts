import friendShipStatus from "../../../enums/friend-ship-status";
import FriendRepository from "../../../Repositories/friends.repository";
import AppError from "../../../utils/app-error";

const friendRepo = new FriendRepository();
const deleteFriendService = async (userId: number, targetUserId: number) => {
  // 1. Act: Attempt to delete an accepted friendship directly
  const result = await friendRepo.deleteFriendship(userId, targetUserId);

  if (result.count > 0) {
    return result;
  }

  // 2. Diagnose: Fetch any existing record between both users to specify error
  const existingRelation = await friendRepo.getFriendshipStatus(
    userId,
    targetUserId,
  );

  if (!existingRelation) {
    throw new AppError("Friendship or record not found", 404);
  }

  if (existingRelation.status === friendShipStatus.pending) {
    throw new AppError(
      "Cannot unfriend. The friendship request is still pending",
      400,
    );
  }

  if (existingRelation.status === friendShipStatus.rejected) {
    throw new AppError(
      "Cannot unfriend. The friendship request was rejected",
      400,
    );
  }

  throw new AppError("No active friendship found to delete", 400);
};

export default deleteFriendService;
