import PostRepository from "../../../Repositories/post.repository";
import { CreatePostDTO } from "./types";

const postRepo = new PostRepository();

const createPostService = async (data: CreatePostDTO) => {
  const post = await postRepo.create(data);
  return post;
};

export default createPostService;
