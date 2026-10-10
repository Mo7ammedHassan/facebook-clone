import { number } from "zod";
import { Prisma } from "../../generated/prisma/browser";
import prisma from "../config/prisma-client.config";
import GroupRole from "../enums/group-role";
import GroupStatusRequest from "../enums/group-status-requests";
import postStatus from "../enums/post-status";

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
    });
  }
  async getGroupDetails(groupId: number) {
    return await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          where: { role: { in: [GroupRole.owner, GroupRole.admin] } },
          select: {
            role: true,
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
        },
        _count: {
          select: {
            members: true,
            posts: {
              where: { status: postStatus.approved },
            },
          },
        },
        cover: {
          select: {
            publicId: true,
            fileName: true,
            filePath: true,
          },
        },
      },
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

  async thisUserRequestToJoin(groupId: number, userId: number) {
    return await prisma.groupJoinRequest.findFirst({
      where: {
        groupId,
        userId,
      },
    });
  }

  async leave(groupId: number, userId: number) {
    return await prisma.membersOfGroup.updateMany({
      where: {
        groupId,
        userId,
      },
      data: {
        leavedAt: new Date(),
      },
    });
  }
  
  async listPosts(groupId: number, status?: postStatus) {
    return await prisma.post.findMany({
      where: {
        groupId: groupId,
        status: status ? status : postStatus.approved,
      },

      orderBy: { createdAt: "desc" },
    });
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

  async cancelGroupRequest(requestId: number) {
    return await prisma.groupJoinRequest.delete({
      where: {
        id: requestId,
      },
    });
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
    return groups.map((group) => group.groupId);
  }

  async thisUserIsMember(groupId: number, userId: number) {
    return await prisma.membersOfGroup.findFirst({
      where: {
        groupId: groupId,
        userId: userId,
        leavedAt: null,
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
        leavedAt: null,
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

  async getMemberDetails(groupId: number, userId: number) {
    return prisma.membersOfGroup.findMany({
      where: {
        groupId,
        userId,
        
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            joinAt: true,
            image: {
              select: {
                filePath: true,
              },
            },
          },
        },
      },
    });
  }
  async getMembers(groupId: number, limit: number, cursor?: number) {
    return prisma.membersOfGroup.findMany({
      where: {
        groupId,
        leavedAt: null,
      },
      orderBy: [{ joinedAt: "desc" }, { id: "desc" }],
      take: limit,
      ...(cursor !== undefined
        ? {
            skip: 1,
            cursor: {
              id: cursor,
            },
          }
        : {}),
      include: {
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
  }
  //  group: {
  //           select: {
  //             posts: {
  //               select: {
  //                 id: true,
  //                 status: true,
  //                 createdAt: true,
  //                 content: true,
  //                 updatedAt: true,
  //                 images: {
  //                   select: {
  //                     image: {
  //                       select: {
  //                         filePath: true,
  //                       },
  //                     },
  //                   },
  //                 },
  //                 parentPost: {
  //                   select: {
  //                     id: true,
  //                     content: true,
  //                     images: {
  //                       select: {
  //                         image: {
  //                           select: {
  //                             filePath: true,
  //                           },
  //                         },
  //                       },
  //                     },
  //                     author: {
  //                       select: {
  //                         id: true,
  //                         name: true,
  //                         image: {
  //                           select: {
  //                             filePath: true,
  //                           },
  //                         },
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  async updateMemberRole(groupId: number, userId: number, role: GroupRole) {
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
