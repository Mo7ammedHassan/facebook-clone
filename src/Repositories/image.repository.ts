import prisma from "../config/prisma-client.config";

class ImageRepository {
    async createImage(data: {
        publicId: string;
        path: string;
        fileName: string
    }) {
        return await prisma.image.create({
            data: {
                fileName: data.fileName,
                filePath: data.path,
                publicId: data.publicId
            },
        });
    }
}

export default ImageRepository;