import FriendRepository from "../../../Repositories/friends.repository";

const friendRepo = new FriendRepository();
const listFriendsService =async(userId:number, limit: number, cursor?: number) =>{
    return await friendRepo.getAllFriends(userId, limit, cursor);
};

export default listFriendsService;