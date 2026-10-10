import GroupRepository from "../../../Repositories/group.repository";
import PostRepository from "../../../Repositories/post.repository";
import AppError from "../../../utils/app-error";
import canViewPost from "../can-view-post";

const postRepo = new PostRepository();
const groupRepo = new GroupRepository();
//هل الجروب خاص
//هل هو عند شخص عامل حسابه خاص
//لو اه هل هما صحاب
const getPostByIdService = async (currentUserId: number, postId: number) => {
  const post = await postRepo.postById({ postId });

  if (!post || post.deletedAt) {
    throw new AppError("Post not found or deleted", 404);
  }

  if (await canViewPost(currentUserId, post.id)) {
    return post;
  } else {
    throw new AppError("You can't view this post", 403);
  }
};

export default getPostByIdService;
