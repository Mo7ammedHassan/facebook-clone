import FriendRepository from "../../../Repositories/friends.repository";
import UserRepository from "../../../Repositories/user.repository";

const friendRepo = new FriendRepository();
const userRepo = new UserRepository();
const addFriendService = async (senderId: number, receiverId: number) => {
  const receiver = await userRepo.findById(receiverId);
  
  if (!receiver) throw new Error("Receiver not found");

  await friendRepo.sendRequest(senderId, receiverId);
};

export default addFriendService;
