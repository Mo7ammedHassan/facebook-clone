import FriendRepository from "../../../Repositories/friends.repository";

const friendRepo = new FriendRepository();

const listFriendSentToMeRequestsService = async (userId: number, limit: number, cursor?: number) => {
    return await friendRepo.getRequestsSentToMe(userId, limit, cursor);
};

export default listFriendSentToMeRequestsService;