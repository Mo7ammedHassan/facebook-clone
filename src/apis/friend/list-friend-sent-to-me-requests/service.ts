import FriendRepository from "../../../Repositories/friends.repository";

const friendRepo = new FriendRepository();

const listFriendSentToMeRequestsService = async (userId: number) => {
    return await friendRepo.getRequestsSentToMe(userId);
};

export default listFriendSentToMeRequestsService;