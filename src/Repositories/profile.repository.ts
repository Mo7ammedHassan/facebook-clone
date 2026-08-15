import updateProfileData from "../apis/user/profile/update-data/types";
import prisma from "../config/prisma-client.config";

export class ProfileRepository {
  async createProfileForUser(userId: number, dateOfBirth: Date, bio?: string) {
    return await prisma.profile.create({
      data: {
        userId: userId,
        dateOfBirth: dateOfBirth,
        bio: bio || "Hello, I'm new to Facebook",
      },
    });
  }

  async findProfileByUserId(userId: number) {
    return await prisma.profile.findUnique({
      where: { userId: userId },
    });
  }

async updateProfile(
  userId: number,
  data: updateProfileData,
) {
  return await prisma.profile.update({
    where: { userId },
    data:{...data},
  });
}
}

export default ProfileRepository;
