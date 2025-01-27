import { SetMetadata } from '@nestjs/common';
import { Permission } from '@prisma/client';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermission = (
  interfaceName: string,
  action: string
) => SetMetadata('permission', { interfaceName, action });
