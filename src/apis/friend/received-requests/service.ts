import FriendRepository from "../../../Repositories/friends.repository";

const friendRepo = new FriendRepository();

const receivedRequestsService = async (userId: number,limit: number,cursor?: number,) => {
  return await friendRepo.getRequestsSentToMe(userId, limit, cursor);
};

export default receivedRequestsService;
