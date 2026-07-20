import prisma from "../config/prisma-client.config";

class UserRepository {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async updateById(
    id: number,
    data: {
      isBlock?: boolean;
      name?: string;
      imageId?: number;
      isPrivate?: boolean;
      isEmailVerified?: boolean;
    },
  ) {
    return await prisma.user.update({
      where: { id },
      data: {
        isBlock: data.isBlock,
        name: data.name,
        imageId: data.imageId,
        isPrivate: data.isPrivate,
        isEmailVerified: data.isEmailVerified,
      },
    });
  }

  async softDeleteById(id: number) {
    const updateData: any = { deletedAt: new Date() };
    return await prisma.user.update({
      where: { id },
      // cast to any because the generated Prisma types for UserUpdateInput
      // may not include deletedAt depending on the schema (soft-delete field)
      data: updateData,
    });
  }

  // اسرع في التحقق
  async existsByEmail(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email },
    });
    return count > 0;
  }
  
  async publicIdExists(publicId: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { publicId },
    });
    return count > 0;
  } 

  async createUser(data: {
    email: string;
    passwordHash: string;
    name: string;
    publicId: string;
  }) {
    return await prisma.user.create({
      data: {
        email: data.email,
        password: data.passwordHash,
        name: data.name,
        publicId: data.publicId,
      },
    });
  }
}

export default UserRepository;
