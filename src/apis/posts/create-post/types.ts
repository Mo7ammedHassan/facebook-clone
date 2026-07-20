export interface CreatePostDTO {
  content?: string;
  userId: number;
  groupId?: number | null;
  images?: {
    publicId: string;
    fileName: string;
    filePath: string;
    orderIndex: number;
  }[];
}
