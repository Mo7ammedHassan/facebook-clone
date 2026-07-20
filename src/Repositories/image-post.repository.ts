import prisma from "../config/prisma-client.config";

class PostImageRepository {
    async createPostImage(data: {
        postId: number
        imageId: number
    }) {
        return await prisma.postImage.create({
            data: {
                postId: data.postId,
                imageId: data.imageId 
            },
        });
    }
}

export default PostImageRepository;