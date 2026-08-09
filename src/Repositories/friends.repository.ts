import prisma from "../config/prisma-client.config";

export enum friendShipStatus {
  pending = "pending",
  accepted = "accepted",
  rejected = "rejected",
}
class FriendRepository {
  async sendRequest(userId: number, friendId: number) {
    return await prisma.friends.create({
      data: {
        userId,
        friendId,
      },
    });
  }

  // 1. الطلبات اللي جيتلي (أنا جالي طلب من مين؟)
  async getRequestsSentToMe(myUserId: number) {
    const requests = await prisma.friends.findMany({
      where: { friendId: myUserId, status: "pending" },
      select: {
        id: true,
        createdAt: true,
        user: {
          // الراسل
          select: {
            id: true,
            name: true,
            image: { select: { filePath: true } },
          },
        },
      },
    });

    return requests.map((req) => ({
      requestId: req.id,
      createdAt: req.createdAt,
      sender: {
        id: req.user.id,
        name: req.user.name,
        avatar: req.user.image?.filePath || null,
      },
    }));
  }

  // 2. الطلبات اللي أنا بعتها (أنا بعت طلب لمين؟)
  async getRequestsSentByMe(myUserId: number) {
    const requests = await prisma.friends.findMany({
      where: { userId: myUserId, status: "pending" },
      select: {
        id: true,
        createdAt: true,
        friend: {
          // المستقبل
          select: {
            id: true,
            name: true,
            image: { select: { filePath: true } },
          },
        },
      },
    });

    return requests.map((req) => ({
      requestId: req.id,
      createdAt: req.createdAt,
      receiver: {
        // غيرنا اسم friend لـ receiver
        id: req.friend.id,
        name: req.friend.name,
        avatar: req.friend.image?.filePath || null,
      },
    }));
  }

  async getAllFriends(myUserId: number) {
    const friends = await prisma.friends.findMany({
      where: {
        status: friendShipStatus.accepted,
        OR: [{ userId: myUserId }, { friendId: myUserId }],
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            image: { select: { filePath: true } },
          },
        },
        friend: {
          select: {
            id: true,
            name: true,
            image: { select: { filePath: true } },
          },
        },
      },
    });

    // هنا بنحدد مين الصديق ومين أنا
    return friends.map((f) => {
      const friendData = f.user.id === myUserId ? f.friend : f.user;
      return {
        id: friendData.id,
        name: friendData.name,
        avatar: friendData.image?.filePath || null,
      };
    });
  }

  async acceptRequest(userId: number, friendId: number) {
    return await prisma.friends.updateMany({
      where: {
        userId,
        friendId,
        status: friendShipStatus.pending,
      },
      data: {
        status: friendShipStatus.accepted,
      },
    });
  }

  async rejectRequest(userId: number, friendId: number) {
    return await prisma.friends.updateMany({
      where: {
        userId,
        friendId,
      },
      data: {
        status: friendShipStatus.rejected,
      },
    });
  }

  async getFriendshipStatus(myUserId: number, otherUserId: number) {
    return await prisma.friends.findFirst({
      where: {
        OR: [
          { userId: myUserId, friendId: otherUserId },
          { userId: otherUserId, friendId: myUserId },
        ],
      },
    });
  }

  async deleteFriendship(userId: number, friendId: number) {
    return await prisma.friends.deleteMany({
      where: {
        OR: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });
  }

  async getMyFriendsIds(userId: number): Promise<number[]> {
    const friends = await prisma.friends.findMany({
      where: {
        userId,
      },
      select: {
        friendId: true,
      },
    })
    return friends.map(friend => friend.friendId)
  }
}

export default FriendRepository;
