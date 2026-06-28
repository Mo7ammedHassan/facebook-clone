import prisma from "../config/prisma-client.config";

export class ProfileRepository {
  async createProfileForUser(userId: number, dateOfBirth: Date, bio?: string) {
    return await prisma.profile.create( {
      data: {
        userId: userId,
        dateOfBirth: dateOfBirth,
        bio: "Hello, I'm new to Facebook"!, 
      },
    });
  }

  async findProfileByUserId(userId: number) {
    return await prisma.profile.findUnique({
      where: { userId: userId },
    });
  }
}

export default ProfileRepository;
