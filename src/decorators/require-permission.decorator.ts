import { SetMetadata } from '@nestjs/common';
import { Permission } from '@prisma/client';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermission = (
  interfaceName: string,
  action: keyof Permission,
) => SetMetadata('permission', { interfaceName, action });
