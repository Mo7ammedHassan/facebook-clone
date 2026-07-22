import { PostStatus } from "../../../../Repositories/post.repository";

export interface CreatePostDTO {
  content?: string;
  userId: number;
  groupId: number;
  status?: PostStatus;
  images?: {
    publicId: string;
    fileName: string;
    filePath: string;
    orderIndex: number;
  }[];
}
