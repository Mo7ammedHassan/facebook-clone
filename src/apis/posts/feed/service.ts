import PostRepository from "../../../Repositories/post.repository";
import GroupRepository from "../../../Repositories/group.repository";
import FriendRepository from "../../../Repositories/friends.repository";
import filterFeed from "./filter-feed";

const postRepo = new PostRepository();
const groupRepo = new GroupRepository();
const friendRepo = new FriendRepository();

const feedService = async (currentUserId: number, limit: number=10, cursor?: number) => {
  const [myGroupIds, myFriendIds] = await Promise.all([
    groupRepo.getMyGroupIds(currentUserId),
    friendRepo.getMyFriendsIds(currentUserId),
  ]);
  const posts = await postRepo.feed({ currentUserId, myGroupIds, myFriendIds , limit, cursor });
  if (!posts) return [];
  return filterFeed(posts, currentUserId, myFriendIds, myGroupIds);
};

export default feedService;