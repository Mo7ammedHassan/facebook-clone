import { Prisma } from "../../generated/prisma/browser";
import prisma from "../config/prisma-client.config";

enum role {
  owner = "owner",
  admin = "admin",
  member = "member",
}

interface ICreateGroup {
  name: string;
  ownerId: number;
  optional?: {
    description?: string;
    rules?: string;
    isOpen?:boolean;
    isPrivate?:boolean;
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
      isPrivate: data.optional?.isPrivate
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
        role: role.owner,
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

  // group request 


  // accepted members
  async addMember(groupId: number, userId: number) {
    return await prisma.membersOfGroup.create({
      data: {
        groupId,
        userId,
      },
    });
  }

  async thisUserIsMember(groupId: number, userId: number) {
    return await prisma.membersOfGroup.count({
      where: {
        groupId:groupId,
        userId:userId,
      },
    });
  }

  async getMember(groupId: number, userId: number) {
    return await prisma.membersOfGroup.findFirst({
      where: {
        groupId,
        userId,
      },
    })
  }
  async removeMember(groupId: number, userId: number) {
    return await prisma.membersOfGroup.deleteMany({
      where: {
        groupId,
        userId,
      },
    });
  }

  async updateMemberRole (groupId: number, userId: number, role: string) {
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

  // requested post in group
}
export default GroupRepository;