import prisma from "../../../config/prisma-client.config";

class LoginSessionRepository {
  async create(data: {
    refreshToken: string;
    expireAt: Date;
    userId: number;
  }) {
    return await prisma.loginSession.create({
      data: {
        refreshToken: data.refreshToken,
        expireAt: data.expireAt,
        userId: data.userId,
      },
    });
  }

  //   async getByUserId(userId: number) {
  //     return await prisma.loginSession.findMany({
  //       where: { userId },
  //     });
  //   }

  async deleteByToken(refreshToken: string) {
    return await prisma.loginSession.deleteMany({
      where: { refreshToken },
    });
  }
}

export default LoginSessionRepository;
