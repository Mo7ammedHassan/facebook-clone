import FriendRepository from "../../Repositories/friends.repository";
import GroupRepository from "../../Repositories/group.repository";
import PostRepository from "../../Repositories/post.repository";


const groupRepo = new GroupRepository();
const postRepo = new PostRepository();
const friendRepo = new FriendRepository();
const canViewPost = async (
  currentUserId: number,
  postId: number,
  visited = new Set<number>(),
): Promise<boolean> => {
  if (visited.has(postId)) return false;
  visited.add(postId);

  const post = await postRepo.findPostAccessData(postId);

  if (!post) return false;

  const isAuthor = post.userId === currentUserId;

  if (!isAuthor && (post.author.isPrivate || post.isPrivate)) {
    const areFriends = await friendRepo.areAcceptedFriends(
      currentUserId,
      post.userId,
    );

    if (!areFriends) return false;
  }

  if (post.group?.isPrivate) {
    const isMember = await groupRepo.getMember(
      post.group.id,
      currentUserId,
    );

    if (!isMember) return false;
  }

  if (post.parentPostId !== null) {
    return canViewPost(currentUserId, post.parentPostId, visited);
  }

  return true;
};

export default canViewPost;