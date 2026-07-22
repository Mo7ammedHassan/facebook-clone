import GroupRepository from "../../../../Repositories/group.repository";
import PostRepository, {
  PostStatus,
} from "../../../../Repositories/post.repository";
import { CreatePostDTO } from "./types";

const postRepo = new PostRepository();
const groupRepo = new GroupRepository();
const createPostService = async (data: CreatePostDTO) => {
  let post;
  let member = await groupRepo.getMember(data.groupId, data.userId);
  if (member) {
    // if you are a member

    if (member.role === "owner" || member.role === "admin")
      post = await postRepo.create(data);

    else if (member.role === "member") {
      data.status = PostStatus.pending;
      post = await postRepo.create(data);
    }
  } else {
    if (!member) {
      throw new Error("You are not a member of this group"); // مش اي حد يقدر ينشر
    }
    return post;
  }
};
export default createPostService;
