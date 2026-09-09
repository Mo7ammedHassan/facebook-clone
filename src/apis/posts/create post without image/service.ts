import PostRepository from "../../../Repositories/post.repository";
import { CreatePostWithoutImageDTO } from "./types";

const postRepo = new PostRepository();

const createPostWithoutImageService = async (
  data: CreatePostWithoutImageDTO,
) => {
  const post = await postRepo.create(data);
  return post;
};

export default createPostWithoutImageService;
