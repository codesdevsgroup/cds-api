import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { permissionsList } from './permissions-list';
import { Permission } from '../../types/permission.types';

const prisma = new PrismaClient();

@Injectable()
export class PermissionsService {
  async getPermissions(userId: string) {
    return prisma.permission.findMany({
      where: {
        userId,
      },
    });
  }

  listPermissions() {
    return permissionsList;
  }

  async editPermissions(
    userId: string,
    updatedPermissions: Partial<Permission>[],
  ) {
    const updatePromises = updatedPermissions.map((perm) =>
      prisma.permission.upsert({
        where: {
          userId_interface: {
            userId,
            interface: perm.interface,
          },
        },
        update: {
          view: perm.view,
          add: perm.add,
          edit: perm.edit,
          delete: perm.delete,
        },
        create: {
          userId,
          interface: perm.interface,
          view: perm.view,
          add: perm.add,
          edit: perm.edit,
          delete: perm.delete,
        },
      }),
    );

    await Promise.all(updatePromises);
    return this.getPermissions(userId);
  }

  async getMyPermissions(userId: string) {
    const permissions = await prisma.permission.findMany({
      where: {
        userId: userId,
      },
    });

    return permissions.map((permission) => ({
      interface: permission.interface,
      view: permission.view,
      add: permission.add,
      edit: permission.edit,
      delete: permission.delete,
    }));
  }
}
