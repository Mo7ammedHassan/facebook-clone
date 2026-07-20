import prisma from "../config/prisma-client.config";

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

    async findByRefreshToken(refreshToken: string) {
      return await prisma.loginSession.findUnique({
        where: { refreshToken },
      });
    }

  async deleteByToken(refreshToken: string) {
    return await prisma.loginSession.deleteMany({
      where: { refreshToken },
    });
  }


async revokeSession(id: number) {
  return await prisma.loginSession.update({
    where: { id },
    data: {revokedAt: new Date()},
    }
  );
}

}
export default LoginSessionRepository;
// str[str. - 1]