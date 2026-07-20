import prisma from "../config/prisma-client.config";

enum PostType {
  normal = "normal",
  shared = "shared",
}
// أنواع البيانات المدخلة للـ Repository (DTO / Types)
 interface CreatePostDTO {
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

export class PostRepository {
  async create(data: CreatePostDTO) {
    // 1. بناء كائن البيانات الأساسي للبوست
    const postData: any = {
      content: data.content,
      userId: data.userId,
      groupId: data.groupId || null,
    };

    // 2. الفحص الذكي: لو الـ Controller بعت صور، ضيف علاقة الإنشاء المتداخلة
    if (data.images && data.images.length > 0) {
      postData.images = {
        create: data.images.map((img) => ({
          image: {
            create: {
              publicId: img.publicId,
              fileName: img.fileName,
              filePath: img.filePath,
              orderIndex: img.orderIndex,
            },
          },
        })),
      };
    }

    // 3. تنفيذ أمر الإنشاء في Prisma بكائن البيانات الديناميكي
    return await prisma.post.create({
      data: postData,
      include: {
        images: {
          include: {
            image: true,
          },
        },
      },
    });
  }

  async createSharedPost(data: {
    userId: number;
    parentPostId: number;
    commentOnPost: string;
    groupId?: number;
  }) {
    return await prisma.post.create({
      data: {
        userId: data.userId,
        parentPostId: data.parentPostId,
        commentOnPost: data.commentOnPost,
        groupId: data.groupId,
        type: PostType.shared,
      },
    });
  }
}

export default PostRepository;
