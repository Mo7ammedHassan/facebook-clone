import prisma from "../config/prisma-client.config";
import friendShipStatus from "../enums/friend-ship-status";

class FriendRepository {
  // Send and cancel friend requests
  async sendRequest(currentUserId: number, friendId: number) {
    return await prisma.friends.create({
      data: {
        userId: currentUserId,
        friendId,
      },
    });
  }

  async cancelRequest(currentUserId: number, targetUserId: number) {
    return await prisma.friends.deleteMany({
      where: {
        status: friendShipStatus.pending,
        userId: currentUserId,
        friendId: targetUserId,
      },
    });
  }

  // --------------------------------

  // Get sent and received friend requests
  async getRequestsSentToMe(
    currentUserId: number,
    limit: number,
    cursor?: number,
  ) {
    const requests = await prisma.friends.findMany({
      where: {
        friendId: currentUserId,
        status: "pending",
      },
      select: {
        id: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            image: {
              select: {
                filePath: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(cursor
        ? {
            skip: 1, // بتتخطى البوست اللي هو الـ cursor نفسه عشان ما يتكررش
            cursor: {
              id: cursor,
            },
          }
        : {}),
      take: limit,
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

  async getRequestsSentByMe(
    currentUserId: number,
    limit: number,
    cursor?: number,
  ) {
    const requests = await prisma.friends.findMany({
      where: {
        userId: currentUserId,
        status: "pending",
      },
      select: {
        id: true,
        createdAt: true,
        friend: {
          select: {
            id: true,
            name: true,
            image: {
              select: {
                filePath: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(cursor
        ? {
            skip: 1,
            cursor: {
              id: cursor,
            },
          }
        : {}),
      take: limit,
    });

    return requests.map((req) => ({
      requestId: req.id,
      createdAt: req.createdAt,
      receiver: {
        id: req.friend.id,
        name: req.friend.name,
        avatar: req.friend.image?.filePath || null,
      },
    }));
  }

  // --------------------------------

  // Accept and reject friend requests
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
        userId: friendId,
        friendId: userId,
        status: friendShipStatus.pending,
      },
      data: {
        status: friendShipStatus.rejected,
      },
    });
  }

  // --------------------------------

  // Get friendship status
  async getFriendshipStatus(currentUserId: number, otherUserId: number) {
    return await prisma.friends.findFirst({
      where: {
        OR: [
          {
            userId: currentUserId,
            friendId: otherUserId,
          },
          {
            userId: otherUserId,
            friendId: currentUserId,
          },
        ],
      },
      select: {
        status: true,
      },
    });
  }

  async getUniqueRequestSentToMe(currentUserId: number, targetUserId: number) {
    return await prisma.friends.findFirst({
      where: {
        userId: targetUserId,
        friendId: currentUserId,
      },
    });
  }
  // --------------------------------

  // Get all friends
  async getAllFriends(currentUserId: number, limit: number, cursor?: number) {
    const friends = await prisma.friends.findMany({
      where: {
        status: friendShipStatus.accepted,
        OR: [{ userId: currentUserId }, { friendId: currentUserId }],
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            image: {
              select: {
                filePath: true,
              },
            },
          },
        },
        friend: {
          select: {
            id: true,
            name: true,
            image: {
              select: {
                filePath: true,
              },
            },
          },
        },
      },
      take: limit,

      ...(cursor
        ? {
            skip: 1,
            cursor: {
              id: cursor,
            },
          }
        : {}),
    });

    return friends.map((f) => {
      const friendData = f.user.id === currentUserId ? f.friend : f.user;

      return {
        id: friendData.id,
        name: friendData.name,
        avatar: friendData.image?.filePath || null,
      };
    });
  }

  // --------------------------------

  // Delete friendship
  async deleteFriendship(userId: number, friendId: number) {
    return await prisma.friends.deleteMany({
      where: {
        status: friendShipStatus.accepted,
        OR: [
          {
            userId: userId,
            friendId: friendId,
          },
          {
            userId: friendId,
            friendId: userId,
          },
        ],
      },
    });
  }

  // --------------------------------

  // Get friend IDs
  async getMyFriendsIds(userId: number): Promise<number[]> {
    const friends = await prisma.friends.findMany({
      where: {
        userId,
        status: friendShipStatus.accepted,
      },
      select: {
        friendId: true,
      },
    });

    return friends.map((friend) => friend.friendId);
  }
}

export default FriendRepository;
