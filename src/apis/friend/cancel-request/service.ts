import FriendRepository from "../../../Repositories/friends.repository";

const friendRepo = new FriendRepository();

const cancelRequestService = async (currentUserId: number, targetUserId: number) => {
    return await friendRepo.cancelRequest(currentUserId, targetUserId);
}

export default cancelRequestService;