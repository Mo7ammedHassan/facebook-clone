import FriendRepository from "../../../Repositories/friends.repository";

const friendRepo= new FriendRepository(); 

const sentRequestsService = (currentUserId: number,limit: number,cursor?: number) => {
    return friendRepo.getRequestsSentByMe(currentUserId, limit, cursor);
    
};

export default sentRequestsService;