import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../guards/require-permission.guard';
import { RequirePermission } from '../../decorators/require-permission.decorator';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { CustomInternalErrorException } from '../../exceptions/custom-internal-error.exception';
import { Response } from 'express';

@ApiTags('Permissions')
@UseGuards(AuthGuard('jwt'))
@UseGuards(PermissionsGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly userService: UserService,
  ) {}

  @RequirePermission('permission', 'view')
  @Get('list')
  async listPermissions() {
    return this.permissionsService.listPermissions();
  }

  @Get('me')
  async getMyPermissions(@CurrentUser() user: User, @Res() res: Response) {
    try {
      const permissions = await this.permissionsService.getMyPermissions(
        user.id,
      );

      return res
        .status(HttpStatus.OK)
        .json(permissions.length ? permissions : []);
    } catch (error) {
      throw new CustomInternalErrorException(error);
    }
  }

  @RequirePermission('permission', 'view')
  @Get('/:id')
  async getPermissions(@Param('id') id: string) {
    return this.permissionsService.getPermissions(id);
  }

  @RequirePermission('permission', 'edit')
  @Post('/:id')
  async editPermissions(
    @Param('id') id: string,
    @Body() updatedPermissions: UpdatePermissionDto[],
  ) {
    return this.permissionsService.editPermissions(id, updatedPermissions);
  }
}
