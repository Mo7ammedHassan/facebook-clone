import { number } from "zod";
import { Prisma } from "../../generated/prisma/browser";
import prisma from "../config/prisma-client.config";
import GroupRole from "../enums/group-role";
import GroupStatusRequest from "../enums/group-status-requests";

interface ICreateGroup {
  name: string;
  ownerId: number;
  optional?: {
    description?: string;
    rules?: string;
    isOpen?: boolean;
    isPrivate?: boolean;
  };
  cover?: {
    publicId: string;
    fileName: string;
    filePath: string;
  };
}

class GroupRepository {
  // group table
  async createGroup(data: ICreateGroup) {
    const groupData: Prisma.GroupCreateInput = {
      name: data.name,
      description: data.optional?.description,
      rules: data.optional?.rules,
      isOpen: data.optional?.isOpen,
      isPrivate: data.optional?.isPrivate,
    };

    if (data.cover) {
      groupData.cover = {
        create: {
          publicId: data.cover.publicId,
          fileName: data.cover.fileName,
          filePath: data.cover.filePath,
        },
      };
    }

    groupData.members = {
      create: {
        userId: data.ownerId,
        role: GroupRole.owner,
      },
    };
    return await prisma.group.create({
      data: groupData,
      include: { members: true, cover: true },
    });
  }

  async getGroup(groupId: number) {
    return await prisma.group.findUnique({
      where: { id: groupId },
      // include: { members: true, cover: true },
    });
  }

  async requestJoinToGroup(groupId: number, userId: number) {
    return await prisma.groupJoinRequest.create({
      data: {
        groupId,
        userId,
      },
    });
  }

  async getRequestJoinById(requestId: number) {
    const request = await prisma.groupJoinRequest.findUnique({
      where: { id: requestId },
      select: {
        groupId: true,
        userId: true,
        status: true,
        actor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return request;
  }

  async acceptGroupRequest(
    requestId: number,
    groupId: number,
    userId: number,
    actorId: number,
  ) {
    return await prisma.$transaction([
      prisma.groupJoinRequest.update({
        where: { id: requestId },
        data: {
          status: GroupStatusRequest.accepted,
          actedById: actorId,
          actedAt: new Date(),
        },
      }),
      prisma.membersOfGroup.create({
        data: {
          groupId,
          userId,
          role: GroupRole.member,
        },
      }),
    ]);
  }

  async rejectGroupRequest(requestId: number, actorId: number) {
    return await prisma.groupJoinRequest.update({
      where: { id: requestId },
      data: {
        status: GroupStatusRequest.rejected,
        actedById: actorId,
        actedAt: new Date(),
      },
    });
  }

  async cancelGroupRequest(requestId: number, actorId: number) {
    
  }

  async getMyGroupIds(userId: number): Promise<number[]> {
    const groups = await prisma.membersOfGroup.findMany({
      where: {
        userId,
      },
      select: {
        groupId: true,
      },
    });
    return groups.map(group => group.groupId);
  }

  async thisUserIsMember(groupId: number, userId: number) {
    return await prisma.membersOfGroup.count({
      where: {
        groupId: groupId,
        userId: userId,
      },
    });
  }

  async addUser(groupId: number, userId: number) {
    return await prisma.membersOfGroup.create({
      data: {
        groupId,
        userId,
        role: GroupRole.member,
      },
    });
  }
  async listRequestsJoinToGroup(groupId: number) {
    const requests = await prisma.groupJoinRequest.findMany({
      where: {
        groupId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
          },
        },
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
    });
    return requests.map((req) => {
      const isPending = req.status === GroupStatusRequest.pending;
      return {
        requestId: req.id,
        requesterId: req.user.id,
        requesterName: req.user.name,
        status: req.status,
        createdAt: req.createdAt,
        avatar: req.user.image?.filePath || null,
        actorId: isPending ? null : req.actor?.id,
        actorName: isPending ? null : req.actor?.name,
        actedAt: isPending ? null : req.actedAt,
      };
    });
  }

  async getMember(groupId: number, userId: number) {
    return await prisma.membersOfGroup.findFirst({
      where: {
        groupId,
        userId,
      },
      select: {
        role: true,
      },
    });
  }
  async removeMember(groupId: number, userId: number) {
    return await prisma.membersOfGroup.deleteMany({
      where: {
        groupId,
        userId,
      },
    });
  }

  async updateMemberRole(groupId: number, userId: number, role: string) {
    return await prisma.membersOfGroup.updateMany({
      where: {
        groupId,
        userId,
      },
      data: {
        role,
      },
    });
  }
}
export default GroupRepository;
