import prisma from "../../../config/prisma-client.config";

class VerificationCodeRepository {
  async createCode(
    userId: number,
    code: string,
    type: "emailVerification" | "passwordReset",
    durationInMinutes: number = 15,
  ) {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + durationInMinutes);

    return await prisma.verificationCode.create({
      data: {
        userId,
        code,
        type,
        expiresAt,
      },
    });
  }

  async findValidCode(userId: number, code: string, type: string) {
    return await prisma.verificationCode.findFirst({
      where: {
        userId,
        code,
        type,
        expiresAt: {
          gt: new Date(), // لازم وقت الانتهاء يكون أكبر من الوقت الحالي
        },
      },
    });
  }

  async deleteUserCodes(userId: number, type: string) {
    return await prisma.verificationCode.deleteMany({
      where: { userId, type },
    });
  }
}

export default VerificationCodeRepository;
