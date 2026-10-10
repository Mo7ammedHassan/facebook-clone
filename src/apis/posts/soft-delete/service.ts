import GroupRole from "../../../enums/group-role";
import GroupRepository from "../../../Repositories/group.repository";
import PostRepository from "../../../Repositories/post.repository";
import AppError from "../../../utils/app-error";

const postRepo = new PostRepository();
const groupRepo = new GroupRepository();

const softDeletePostService = async (postId: number, currentUserId: number) => {
  const post = await postRepo.postById({ postId });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  if (post.userId === currentUserId) {
    return postRepo.softDelete(postId);
  }

  if (post.group) {
    const membership = await groupRepo.getMember(post.group.id, currentUserId);

    const canDelete =
      membership?.role === GroupRole.owner ||
      membership?.role === GroupRole.admin;

    if (canDelete) {
      return postRepo.softDelete(postId);
    }
  }

  throw new AppError("You are not allowed to delete this post", 403);
};

export default softDeletePostService;
