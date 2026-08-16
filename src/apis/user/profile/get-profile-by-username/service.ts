import friendShipStatus from "../../../../enums/friend-ship-status";
import FriendRepository from "../../../../Repositories/friends.repository";
import UserRepository from "../../../../Repositories/user.repository";
import AppError from "../../../../utils/app-error";

const userRepo = new UserRepository();
const friendRepo = new FriendRepository();

const getProfileByUsernameService = async (
  currentUserId: number,
  usernameTarget: string,
) => {
  const user = await userRepo.findByUsername(usernameTarget);
  if (!user) throw new AppError("User not found", 404);

  const { profile, ...userData } = user;

  if (!profile) throw new AppError("Profile not found", 404);

  const friendship = await friendRepo.getFriendshipStatus(
    currentUserId,
    user.id,
  );

  const isOwner = currentUserId === user.id;
  const isFriend = friendship?.status === friendShipStatus.accepted;

  if (profile.isPrivate && !isOwner && !isFriend) {
    return {
      user: {
        name: userData.name,
        publicId: userData.publicId,
        image: userData.image,
      },
      isPrivate: true,
      isOwner: false,
      isFriend: false,
      friendshipStatus: friendship?.status || null,
    };
  }

  return {
    ...profile,
    user: {
      id: userData.id,
      name: userData.name,
      publicId: userData.publicId,
      image: userData.image,
    },
    isOwner,
    isFriend,
    friendshipStatus: friendship?.status || null,
  };
};

export default getProfileByUsernameService;