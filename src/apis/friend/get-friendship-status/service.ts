import FriendRepository from "../../../Repositories/friends.repository";

const  friendRepo = new FriendRepository();

const getFriendshipStatusService= (userId: number, targetUserId: number) => {
    return friendRepo.getFriendshipStatus(userId, targetUserId);
};


export default getFriendshipStatusService